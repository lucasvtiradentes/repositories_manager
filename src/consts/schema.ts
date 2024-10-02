import { z } from 'zod';

const repoWithGroupSchema = z.object({
  domain: z.string().optional(),
  group: z.string().optional(),
  custom_name: z.string().optional()
});

const repoWithPathSchema = z.object({
  local_path: z.string()
});

const commonRepositorySchema = z.object({
  sync: z.boolean().optional(),
  link: z.string().optional()
});

const githubRepositorySchema = commonRepositorySchema.and(repoWithGroupSchema.or(repoWithPathSchema));

export type GithubRepository = Configs['github_repositories'][string];

const sshRepositorySchema = commonRepositorySchema
  .and(
    z.object({
      git_ssh: z.string()
    })
  )
  .and(repoWithGroupSchema.or(repoWithPathSchema));

export type SShRepository = Configs['ssh_repositories'][number];

// =============================================================================

export const configsSchema = z.object({
  $schema: z.string(),
  repos_root_path: z
    .object({
      linux: z.string(),
      darwin: z.string(),
      windows: z.string(),
      wsl: z.string()
    })
    .partial(),
  open_repo_on_editor_command: z.string(),
  github_repositories: z.record(githubRepositorySchema),
  ssh_repositories: z.array(sshRepositorySchema)
});

export type Configs = z.infer<typeof configsSchema>;
