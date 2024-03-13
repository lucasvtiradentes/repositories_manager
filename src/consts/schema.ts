import { z } from 'zod';

const repositoryCategorySchema = z.string().nullable();

const repositoryOptionsSchema = z.object({
  domain: z.string().optional(),
  sync: z.boolean().optional(),
  link: z.string().optional(),
  local_path: z.string().optional()
});

const githubRepositoriesSchema = z.record(z.tuple([repositoryCategorySchema]).or(z.tuple([repositoryCategorySchema, repositoryOptionsSchema])));

const sshRepositorySchema = z
  .object({
    domain: z.string(),
    category: repositoryCategorySchema,
    git_ssh: z.string()
  })
  .merge(repositoryOptionsSchema.omit({ domain: true }));

export const configsSchema = z.object({
  path: z.string(),
  open_repo_on_editor_command: z.string(),
  github_repositories: z.record(githubRepositoriesSchema),
  ssh_repositories: z.array(sshRepositorySchema)
});

export type TConfigs = z.infer<typeof configsSchema>;
