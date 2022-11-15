Rails.application.routes.draw do
  root "posts#index"
  get 'posts/show'
  #Blog
  get "/posts", to:"posts#blog_index"
  get "/posts/:url", to:"posts#show"
end
