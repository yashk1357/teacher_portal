class StudentsController < ApplicationController
  before_action :authenticate_teacher!, except: [:create]
  before_action :set_student, only: [:destroy]
  skip_before_action :verify_authenticity_token, only: [:create]


  def index
    @students = Student.includes(:subject)
  end

  def create
    puts params
    @student = Student.find_or_initialize_by(name: student_params[:name], subject_id: student_params[:subject_id])
    
    if @student.persisted?
      @student.marks += student_params[:marks].to_i # Update marks
    else
      @student.marks = student_params[:marks].to_i # Set marks for new student
    end

    if @student.save
      respond_to do |format|
        format.html { redirect_to students_path, notice: 'Student was successfully added.' }
        format.js 
      end
    else
      respond_to do |format|
        format.html { render :new }
        format.js { render json: @student.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    @student = Student.find(params[:id])
  
    if @student.update(student_params)
      render json: @student , status: :ok
    else
      respond_to do |format|
        format.html { render :edit }
        format.json { render json: @student.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @student.destroy
    flash[:notice] = 'Student was successfully deleted.'
    redirect_to students_path
  end

  private

  def set_student
    @student = Student.find(params[:id])
    puts @student.name
  end

    def student_params
      params.require(:student).permit(:name, :marks, :subject_id)
    end
end
