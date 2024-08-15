import React, { useState } from "react";
import Navigation from "../Reusable/Navigation/navBarSideBar";
import ProjectCard from "./projectCard";

export default function ProjectOverview({ createProjectTrigger, data }) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value.toLowerCase());
  };

  const filteredProjects = data
    .filter((project) => project.title.toLowerCase().includes(searchInput));

  return (
    <>
      <Navigation
        breadcrumbs={[{ text: "Projects", href: "/home/projects" }]}
        createProjectTrigger={createProjectTrigger}
      />
      <div style={{ margin: "20px" }}>
        <input
          type="search"
          placeholder="Search projects"
          value={searchInput}
          onChange={handleSearchChange}
          className="mb-4 p-2 border border-gray-300 rounded"
          style={{ width: "100%" }}
        />
      </div>
      <div
        style={{ margin: "20px" }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        {filteredProjects.map((project) => (
          <div key={project.id} className="p-4">
            <ProjectCard
              key={project.id}
              projectData={{
                ...project,
                href: `home/projects/${project.title}`,
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
