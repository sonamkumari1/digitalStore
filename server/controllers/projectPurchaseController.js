import Stripe from "stripe";
import Project from "../model/projectModel.js";
import ProjectPurchase from "../model/projectPurchase.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.title) {
      return res.status(400).json({ message: "Project title is missing" });
    }

    const newPurchase = new ProjectPurchase({
      projectId,
      userId,
      amount: project.price,
      status: "pending",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: project.title,
              images: project.thumbnail ? [project.thumbnail] : [],
            },
            unit_amount: project.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/project/${projectId}`,
      cancel_url: `http://localhost:5173/project/${projectId}`,
      metadata: { projectId, userId },
      shipping_address_collection: { allowed_countries: ["IN"] },
    });

    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const stripeWebhook = async (req, res) => {
  let event;
  try {
    const payload = req.body;
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

    event = stripe.webhooks.constructEvent(
      JSON.stringify(payload, null, 2),
      req.headers["stripe-signature"],
      secret
    );
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;
      const purchase = await ProjectPurchase.findOne({ paymentId: session.id }).populate("projectId");

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      purchase.amount = session.amount_total / 100;
      purchase.status = "completed";
      await purchase.save();
    } catch (error) {
      console.error("Error handling event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  res.status(200).send();
};

export const getProjectDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(projectId).populate("creator");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const purchased = await ProjectPurchase.findOne({ userId, projectId });
    return res.status(200).json({ project, purchased: !!purchased });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllPurchasedProjects = async (_, res) => {
  try {
    const purchasedProjects = await ProjectPurchase.find({ status: "completed" }).populate("projectId");
    return res.status(200).json({ purchasedProjects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
