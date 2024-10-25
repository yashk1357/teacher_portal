class CreateStudents < ActiveRecord::Migration[7.2]
  def change
    create_table :students do |t|
      t.string :name
      t.integer :marks
      t.references :subject, null: false, foreign_key: true

      t.timestamps
    end
  end
end
