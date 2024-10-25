document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const row = event.target.closest('tr');
      
      // Make fields editable
      row.querySelectorAll('.editable').forEach(cell => {
        cell.setAttribute('contenteditable', 'true');
        cell.style.border = '1px solid #ddd';
      });

      // Show Save button and hide Edit button
      row.querySelector('.save-btn').style.display = 'inline-block';
      event.target.style.display = 'none';
    });
  });

  // Handle Save button click
  document.querySelectorAll('.save-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const studentId = event.target.dataset.studentId;
      const row = event.target.closest('tr');
      const name = row.querySelector('[data-field="name"]').innerText.trim();
      const marks = row.querySelector('[data-field="marks"]').innerText.trim();

      fetch(`/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({
          student: {
            name: name,
            marks: marks
          }
        })
      })
      .then(response => {
        if (response.ok) {
          alert('Student updated successfully');
        } else {
          alert('Failed to update student');
        }
      })
      .catch(error => {
        alert('Network error');
      });

      // Disable editing
      row.querySelectorAll('.editable').forEach(cell => {
        cell.setAttribute('contenteditable', 'false');
        cell.style.border = 'none';
      });

      // Show Edit button and hide Save button
      row.querySelector('.edit-btn').style.display = 'inline-block';
      event.target.style.display = 'none';
    });
  });

  const modal = document.getElementById("new-student-modal");
  const overlay = document.getElementById("modal-overlay");
  const openModalButton = document.getElementById("new-student-button"); // Assume you have a button to open the modal
  const closeModalButton = document.getElementById("close-modal");
  const form = document.getElementById("new-student-form");
  // Function to open the modal
  function openModal() {
    modal.style.display = "block";
    overlay.style.display = "block";
  }

  // Function to close the modal
  function closeModal() {
    modal.style.display = "none";
    overlay.style.display = "none";
  }

  // Event listeners
  if (openModalButton) {
    openModalButton.addEventListener("click", openModal);
  }


  // Close modal if clicking outside of it
  overlay.addEventListener("click", closeModal);
  
    // Handle form submission
    form.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent the default form submission
      console.log("came inside")
      // Get form data
      const studentName = document.getElementById('student_name').value;
      const subjectId = document.getElementById('subject_id').value;
      const marks = document.getElementById('marks').value;
  
      fetch('/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student: {
            name: studentName,
            subject_id: subjectId,
            marks: marks
          }
        }),
      })
      .then(response => {
        if (response.ok) {
          // Success! Reload the page to show the new student
          location.reload();
        } else {
          // Handle error
          alert('Error adding student. Please check your input.');
        }
      })
      .catch(error => {
        // Handle network error
        alert('Network error. Please try again later.');
      });
  
      modal.style.display = 'none'; // Hide the modal
    });

    
    closeModalButton.addEventListener("click", closeModal);

  });
  