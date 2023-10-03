import Navigation from "../Reusable/Navigation/navBarSideBar";
import ProjectCard from "./projectCard";

export default function ProjectOverview({ createProjectTrigger }) {
  return (
    <>
      <Navigation
        breadcrumbs={[{ text: "Projects", href: "/home/projects" }]}
        createProjectTrigger={createProjectTrigger}

      />

      <div style={{ margin: "20px" }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <ProjectCard
          projectData={{
            title: "My First Project",
            author: "John Doe",
            description: "Praesent non ornare massa duis magnis ut eros at ad facilisi senectus nascetur, blandit rutrum cursus porttitor tempor lectus sociosqu augue tempus vestibulum.",
            href: "/project1",
          }}
        />
      </div>

    </>
  );
}
