class PostsController < ApplicationController
  def show
     (@post = Post.find_by(path:params[:url])) or not_found
  end
   def index
    @posts = Post.where(where: '')
  end

  # Blog in /posts/
  def blog_index
    @posts = Post.where(where: 'posts')
  end
end
