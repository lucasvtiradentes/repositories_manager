import { TExtendedRepo } from '../methods/parse_repositories';

type TPurgeLocalReposCommandProps = {
  parsedRepositories: TExtendedRepo[];
};

export const purgeLocalReposCommand = ({ parsedRepositories }: TPurgeLocalReposCommandProps) => {
  const reposToDelete = parsedRepositories.filter((repo) => repo.exists_locally && repo.ignore_sync === true);
  console.log('purge', reposToDelete);
};
