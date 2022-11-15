class CreatePosts < ActiveRecord::Migration[7.0]
  def change
    create_table :posts do |t|
      t.string :path
      t.string :title
      t.text :tags

      t.timestamps
    end
  end
end
