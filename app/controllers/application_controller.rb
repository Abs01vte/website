class ApplicationController < ActionController::Base
def not_found
 # raise ActionController::RoutingError("Not Found")
  puts "Not Found"
end
end
