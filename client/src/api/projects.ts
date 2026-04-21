import axios from "./axios";

export interface Project {
  _id: string;
  name: string;
  description?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const getProjects = async () => {
  const response = await axios.get("/projects");
  return response.data.data.projects as Project[];
};

export const getProjectById = async (id: string) => {
  const response = await axios.get(`/projects/${id}`);
  return response.data.data.project as Project;
};

export const createProject = async (data: { name: string; description?: string }) => {
  const response = await axios.post("/projects", data);
  return response.data.data.project as Project;
};

export const updateProject = async (id: string, data: { name: string; description?: string }) => {
  const response = await axios.patch(`/projects/${id}`, data);
  return response.data.data.project as Project;
};

export const deleteProject = async (id: string) => {
  const response = await axios.delete(`/projects/${id}`);
  return response.data;
};
