import Navigation from "../Reusable/Navigation/navBarSideBar";
import ProjectCard from "./projectCard";

export default function ProjectOverview({ createProjectTrigger, data }) {
  return (
    <>
      <Navigation
        breadcrumbs={[{ text: "Projects", href: "/home/projects" }]}
        createProjectTrigger={createProjectTrigger}
      />
      <div
        style={{ margin: "20px" }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        {data.map((project) => (

          <ProjectCard
            key={project.id}
            projectData={{
              ...project,
              href: `home/projects/${project.title}`,
            }}
          />
        ))}
      </div>

    </>
  );
}
