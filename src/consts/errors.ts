export const ERRORS = {
  system_not_supported: 'your OS is not supported as of now!',
  configs_file_dont_follow_required_schema: 'the specified configs file does not follows the required schema!',
  configs_file_does_not_exists: 'the specified configs file does not exists!',
  method_requires_configs: 'this method is available only after setup your configs file!',
  missing_os_repos_folder: 'please specify the path to your repositories based on your current operating system!',
  json_not_found: (_path: string) => 'json was not found!'
};
