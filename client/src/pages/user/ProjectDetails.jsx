import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useGetProjectByIdQuery } from "@/redux/api/projectApi";
import { useCreateCheckoutSessionMutation } from "@/redux/api/purchaseApi";


const ProjectDetails = () => {
  const { projectId } = useParams();

  const { data, isLoading, isError } = useGetProjectByIdQuery(projectId);
  const [createCheckoutSession, { isLoading: isPurchasing }] =
    useCreateCheckoutSessionMutation();

  if (isLoading)
    return <div className="text-white text-center mt-20">Loading...</div>;
  if (isError)
    return (
      <div className="text-red-500 text-center mt-20">
        Error fetching project details...
      </div>
    );

  const handlePurchase = async () => {
    try {
      const response = await createCheckoutSession(projectId).unwrap();
      if (response?.url) {
        window.location.href = response.url; // Redirect to Stripe checkout
      } else {
        console.error("Missing checkout URL in response");
      }
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  console.log(data?.project)

  return (
    <div className="py-16 bg-black min-h-screen px-6 md:px-12">
      <div className="bg-black p-6 rounded-lg text-center">
        <h1 className="text-3xl font-bold text-white">{data?.title}</h1>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-12 mt-10 justify-center">
        {/* Left Section - Video & Project Details */}
        <div className="w-full md:w-[650px]">
          <h2 className="text-2xl font-semibold text-white mb-5">
            {data?.project?.title}
          </h2>
          {data?.project?.video && (
            <video controls className="w-full h-auto mb-4 rounded-lg shadow-lg">
              <source src={data?.project?.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          <h2 className="text-2xl font-semibold text-white mb-5">
            Project Details
          </h2>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white">Category:</span>
              <span className="text-md text-gray-300">
                {data?.project?.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white">Creator Name:</span>
              <span className="text-md text-gray-300">
                {data?.project?.creator?.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white">Creater Mail Id:</span>
              <span className="text-md text-gray-300">
                {data?.project?.creator?.email}
              </span>
            </div>

            {/* Step-by-Step Description */}
            <div className="mt-4 space-y-2">
              <h3 className="font-bold text-lg text-white">Description:</h3>
              {data?.project?.description?.split("\n").map((step, index) => (
                <p key={index} className="text-md text-gray-300">
                  • {step}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Thumbnail & Purchase Card */}
        <div className="w-full md:w-[350px] mt-12">
          <Card className="bg-gray-900 overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="relative">
              <img
                src={data?.project?.thumbnail}
                alt="Project Thumbnail"
                className="w-full h-auto rounded-lg"
              />
            </div>
            <CardContent className="px-5 pt-3 space-y-3">
              <div className="font-bold text-lg text-white">Price</div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 ">
                  <span className="text-green-400 text-sm">
                    {data?.project?.discountPercentage}% off
                  </span>
                  <span className="text-sm line-through text-gray-500">
                    ₹{data?.project?.price}
                  </span>
                  <span className="font-bold text-lg text-white">
                    ₹
                    {(
                      data?.project?.price -
                      (data?.project?.price *
                        data?.project?.discountPercentage) /
                        100
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                className="w-full flex items-center gap-3 justify-center bg-green-600 hover:bg-green-500 text-white px-5 py-2 text-md rounded-full transition-all duration-300"
                disabled={isPurchasing}
                onClick={handlePurchase}
              >
                {isPurchasing ? "Processing..." : "Buy Now"}
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
