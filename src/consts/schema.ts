import { z } from 'zod';

const repoWithGroupSchema = z.object({
  parent: z.string(),
  group: z.string().optional()
});

const repoWithPathSchema = z.object({
  local_path: z.string()
});

const commonRepositorySchema = z.object({
  sync: z.boolean().optional(),
  link: z.string().optional()
});

const githubRepositorySchema = commonRepositorySchema.and(repoWithGroupSchema.partial({ parent: true }).or(repoWithPathSchema));

export type GithubRepository = TConfigs['github_repositories'][string];

const sshRepositorySchema = commonRepositorySchema
  .and(
    z.object({
      git_ssh: z.string()
    })
  )
  .and(repoWithGroupSchema.or(repoWithPathSchema));

export type SShRepository = TConfigs['ssh_repositories'][number];

// =============================================================================

export const configsSchema = z.object({
  $schema: z.string(),
  path: z.string(),
  open_repo_on_editor_command: z.string(),
  github_repositories: z.record(githubRepositorySchema),
  ssh_repositories: z.array(sshRepositorySchema)
});

export type TConfigs = z.infer<typeof configsSchema>;
