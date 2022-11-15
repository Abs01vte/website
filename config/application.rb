require_relative "boot"

require "rails/all"
Bundler.require(*Rails.groups)

module Website
  class Application < Rails::Application
    config.load_defaults 7.0
    config.public_file_server.enabled = true
  end
end
