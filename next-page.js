document.addEventListener('DOMContentLoaded', () => {
    // Get the selected language from the cookie or local storage
    const selectedLanguageCode = getSelectedLanguage();

    const grammarLessons = document.getElementById('grammar-lessons');
    const vocabLessons = document.getElementById('vocab-lessons');
    const writingLessons = document.getElementById('writing-lessons');

    const content = document.getElementById('content');
    const test = document.getElementById('test-area');
    test.style.display = 'none';

    const attemptTestButton = document.getElementById('attempt-test');
    attemptTestButton.addEventListener('click', function() {
        if (test.style.display === 'none') {
          test.style.display = 'block';
        } else {
          test.style.display = 'none';
        }
    });

    const progressBar = document.getElementById('progress-bar');

    let currentTopicInView = '';
    let currentSubjectLessons = [];
    let totalLessonsCompleted = [];

    let payload = {
      "username": localStorage.getItem('username'),
      "languages": ["Dummy"],
      "lessons": [],
      "score": 1000,
      "completed": false
    };

    const logOutButton = document.getElementById('log-out');
    logOutButton.addEventListener('click', function(){
      const username = payload.username;

      fetch('http://127.0.0.1:5000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({username})
        })
        .then(response => response.json())
        .then(data => {
          window.location.href = 'index.html';
        })
        .catch(error => console.error('Error:', error));
    });

    function updateProgress(){
        fetch('http://127.0.0.1:5000/api/learning/materials/user_progress_update/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }

    function getUserProgress(){
      fetch(`http://127.0.0.1:5000/api/learning/materials/user_progress/${payload.username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        totalLessonsCompleted = data.User_Progress[0].lessons;         
      })
      .catch(error => {
        console.error(error);
      });
    }

    function calculateProgress(){
      setTimeout(function() {
      const allLessonCollection = [];
      const completedLessons = [];

      for(i=0; i<currentSubjectLessons.length; i++){
        const eachSubjectLesson = currentSubjectLessons[i];
        
        for(j=0; j<eachSubjectLesson.length; j++){
          allLessonCollection.push(eachSubjectLesson[j].title);
        }
      }

      for(i=0; i<totalLessonsCompleted.length; i++){
        completedLessons.push(totalLessonsCompleted[i]);
      }

      const commonElements = allLessonCollection.filter(element => completedLessons.includes(element));

      const count = commonElements.length;

      progressBar.innerHTML = `${Math.round((count / allLessonCollection.length) * 100)}% complete (${count} out of ${allLessonCollection.length} lessons)`;
      }, 3500);
    }

    const markCompleteButton = document.getElementById('mark-complete');
    
    markCompleteButton.addEventListener('click', () => {
      payload.lessons.push(currentTopicInView);
      payload.completed = true;

      updateProgress();      
    });    

    function organizeLessons(lessonList, htmlLessons) {
        for (let i = 0; i < lessonList.length; i++) {
            const listItem = document.createElement('li');
            listItem.textContent = lessonList[i].title;
            listItem.classList.add('lesson-link');

            listItem.addEventListener('click', () => {
                // Clear the content column
                content.innerHTML = '';
                currentTopicInView = listItem.textContent;
                console.log(`The user is viewing ${currentTopicInView}`);

                // Display the corresponding lesson content
                const contentParagraph = document.createElement('p');
                contentParagraph.textContent = lessonList[i].content;
                content.appendChild(contentParagraph);

                test.innerHTML = '';

                const quizCollection = lessonList[i].quiz;

                if (quizCollection.length > 0) {
                    for (let j = 0; j < quizCollection.length; j++) {
                        const question = document.createElement('p');
                        question.textContent = 'Question #' + (j + 1) + ': ' + quizCollection[j].question;
                        test.appendChild(question);

                        const optionsCollection = quizCollection[j].options;

                        const radioGroup = document.createElement("div");
                        radioGroup.setAttribute("role", "radiogroup");

                        for (let k = 0; k < optionsCollection.length; k++) {
                            const option = document.createElement('input');
                            option.type = 'radio';
                            option.name = optionsCollection[k];
                            option.value = optionsCollection[k];

                            //option.textContent = 'Option #'+(k+1)+': '+optionsCollection[k];
                            test.appendChild(option);

                            option.addEventListener('click', function() {
                                console.log(option.checked);
                                console.log('Radio button value:', this.value);
                                if (option.value !== quizCollection[j].answer) {
                                    alert('Incorrect answer, try again.');
                                    option.checked = false;
                                } else {
                                    option.checked = true;
                                    alert('Right answer!');
                                }
                            });

                            const label = document.createElement("label");
                            label.textContent = optionsCollection[k];
                            test.appendChild(label);

                            const br = document.createElement("br");
                            test.appendChild(br);
                        }
                    }
                }
            });

            htmlLessons.appendChild(listItem);
        }
    }

    // Send a GET request to the API with the selected language as a query parameter
    fetch(`http://127.0.0.1:5000/api/learning/materials/${selectedLanguageCode}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const grammarLessonList = data[1][0].Grammar.lessons;
            const vocabLessonList = data[1][0].Vocabulary.lessons;
            const writingLessonList = data[1][0].Writing.lessons;

            currentSubjectLessons.push(grammarLessonList);
            currentSubjectLessons.push(vocabLessonList);
            currentSubjectLessons.push(writingLessonList);

            organizeLessons(grammarLessonList, grammarLessons);
            organizeLessons(vocabLessonList, vocabLessons);
            organizeLessons(writingLessonList, writingLessons);            
        })
        .catch(error => {
            // Handle the error
            console.error(error);
        });

    getUserProgress();    
    
    function getSelectedLanguage() {
        const selectedLanguage = JSON.parse(localStorage.getItem('selectedLanguage'));
        console.log(`lang code in cache is: ${selectedLanguage}`);

        if (selectedLanguage) {
            return selectedLanguage;
        }

        return null;
    }

    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");

            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }

    calculateProgress();
});