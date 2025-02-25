import { useGetAllLikedProjectsQuery } from '@/redux/api/projectApi';
import React from 'react'
import { useSelector } from 'react-redux';
import Projects from './Projects';

function LikesPage() {
  const { user } = useSelector((state) => state.auth); 
  const { data: likedProjects, error, isLoading } = useGetAllLikedProjectsQuery(); 

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Liked Projects</h2>

      {isLoading && <p>Loading liked projects...</p>}
      {error && <p className="text-red-500">Error fetching projects.</p>}

      {likedProjects?.length === 0 ? (
        <p>No liked projects yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {likedProjects?.map((project) => (
            <Projects key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

export default LikesPage
