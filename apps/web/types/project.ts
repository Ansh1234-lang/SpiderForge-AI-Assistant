export interface Project{
    id:string;
    name:string;
    githuburl:string;
    createdAt:string;
    updatedAt:string
}
export interface GetProjectResponse{
    success:boolean;
    count:number;
    data:Project[];
}