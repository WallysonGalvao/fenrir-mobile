export interface ProjectRepository {
  url: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  repositories: ProjectRepository[] | null;
}
