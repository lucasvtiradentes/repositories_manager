export const ERRORS = {
  configs_file_dont_follow_required_schema: 'the specified configs file does not follows the required schema!',
  configs_file_does_not_exists: 'the specified configs file does not exists!',
  method_requires_configs: 'this method is available only after setup your configs file!',
  json_not_found: (_path: string) => 'json was not found!'
};
