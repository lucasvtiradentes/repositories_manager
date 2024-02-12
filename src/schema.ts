import { z } from 'zod';

const zCategory = z.string().nullable();

const zRepoOptions = z.object({
  ignore_sync: z.boolean().optional(),
  domain: z.string().optional()
});

const zTuple = z.tuple([zCategory]).or(z.tuple([zCategory, zRepoOptions]));

const zGithubRepos = z.record(zTuple);

const zSshRepo = z.object({
  domain: z.string(),
  category: z.string().optional(),
  git_ssh: z.string()
});

export const zConfigs = z.object({
  path: z.string(),
  open_command: z.object({
    repository: z.string(),
    configs: z.string()
  }),
  github_repositories: z.record(zGithubRepos),
  ssh_repositories: z.array(zSshRepo)
});

export type TConfigs = z.infer<typeof zConfigs>;
