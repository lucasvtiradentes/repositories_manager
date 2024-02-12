import { TExtendedRepo } from '../methods/parse_repositories';

type TPullMissingReposCommandProps = {
  parsedRepositories: TExtendedRepo[];
};

export const pullMissingReposCommand = ({ parsedRepositories }: TPullMissingReposCommandProps) => {
  const reposToClone = parsedRepositories.filter((repo) => repo.exists_locally === false && repo.ignore_sync !== true);
  console.log('pull', reposToClone);
};
