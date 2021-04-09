const URL = 'http://localhost:3000';

// DOM Nodes
var questionContainerNode = document.getElementsByClassName('question-container')[0];
var questionSubjectNode = document.getElementById('question-subject');
var questionContentNode = document.getElementById('question-content');
var rightPaneNode = document.getElementsByClassName('right-pane')[0];
var newQuestionBtn = document.getElementById('new-question-btn');
var searchBox = document.getElementById('search-box');
var submitButtonNode = document.getElementById('submit-btn');

// Utility functions
async function loadQuestions(term) {
    clearChildren(questionContainerNode);
    var questions = await fetch(`${URL}/getQuestions`).then(async res => {
        let response = await res.json()
        console.log(response);
        return response;
    });
    if (questions === []) {
        questions = [];
    }

    if (questions.length !== 0) {
        questions.forEach(function (question) {
            if (question.subject.toLowerCase().indexOf(term.toLowerCase()) > -1 || term === '') {
                var questionDiv = document.createElement('div');
                questionDiv.setAttribute('class', 'question');
                var title = document.createElement('h2');
                title.innerHTML = question.subject;
                var content = document.createElement('h6');
                content.innerHTML = question.content;
                questionDiv.appendChild(title);
                questionDiv.appendChild(content);
                questionDiv.addEventListener('click', function() {
                    showResolveDiv(question);
                    if (question.comments.length !== 0) {
                        showCommentsDiv(question);
                    }
                    showResponseDiv(question);
                });

                questionContainerNode.appendChild(questionDiv);
            }
        });
    } else {
        var newPara = document.createElement('p');
        newPara.innerHTML = 'No questions found!';
        questionContainerNode.appendChild(newPara);
    }
}

function showCommentsDiv(question) {
    var commentsDiv = document.createElement('div');
    var commentsHeader = document.createElement('h2');
    commentsHeader.innerHTML = 'Response';
    commentsHeader.setAttribute('class', 'comments-header');
    commentsDiv.appendChild(commentsHeader);
    
    var comments = question.comments;
    for (var i = 0; i < comments.length; i++) {
        var commentDetails = document.createElement('div');
        var commentName = document.createElement('h2');
        commentName.innerHTML = comments[i].name;
        var commentContent = document.createElement('h6');
        commentContent.innerHTML = comments[i].content;
        
        commentDetails.setAttribute('class', 'comment-details');
        commentName.setAttribute('class', 'comment-title');
        commentContent.setAttribute('class', 'comment-content');

        commentDetails.appendChild(commentName);
        commentDetails.appendChild(commentContent);
        commentsDiv.appendChild(commentDetails);
    }

    commentsDiv.setAttribute('class', 'comments-container');

    rightPaneNode.appendChild(commentsDiv);
}

function showResponseDiv(question) {
    var responseContainer = document.createElement('div');
    var responseHeader = document.createElement('h2');
    responseHeader.innerHTML = 'Add Response';
    var responseForm = document.createElement('div');
    var responseName = document.createElement('input');
    var responseComment = document.createElement('textarea');
    var submit = document.createElement('span');
    submit.innerHTML = 'Submit';

    responseContainer.setAttribute('class', 'response-container');
    responseHeader.setAttribute('class', 'response-header');
    responseForm.setAttribute('class', 'response-form');
    responseName.setAttribute('type', 'text');
    responseName.setAttribute('name', 'response-name');
    responseName.setAttribute('id', 'response-name');
    responseName.setAttribute('placeholder', 'Enter Name');
    responseComment.setAttribute('id', 'response-comment');
    responseComment.setAttribute('placeholder', 'Enter Comment');
    submit.setAttribute('id', 'response-submit-btn');
    submit.setAttribute('class', 'btn');
    submit.addEventListener('click', function() {
        var comments = question.comments;
        var newComment = {};
        newComment.name = document.getElementById('response-name').value;
        newComment.content = document.getElementById('response-comment').value;
        comments.push(newComment);
        question.comments = comments;
        updateQuestions(question);

        showResolveDiv(question);
        if (question.comments.length !== 0) {
            showCommentsDiv(question);
        }
        showResponseDiv(question);
    });

    responseContainer.appendChild(responseHeader);
    responseForm.appendChild(responseName);
    responseForm.appendChild(responseComment);
    responseContainer.appendChild(responseForm);
    responseContainer.appendChild(submit);
    rightPaneNode.appendChild(responseContainer);
}

async function updateQuestions(question) {
    var questions = await fetch(`${URL}/getQuestions`);
    questions = await questions.json();

    let questionIndex = -1;
    for (var i = 0; i < questions.length; i++) {
        if (questions[i].title === question.title) {
            questionIndex = i;
            break;
        }
    }

    await fetch(`${URL}/updateQuestion/${questionIndex}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(question)
    });
}

function clearChildren(node) {
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
}

function loadQuestionForm() {
    var welcome = document.createElement('h2');
    welcome.innerHTML = 'Welcome to Discussion Portal!';
    var subHead = document.createElement('h5');
    subHead.innerHTML = 'Enter a subject and question to get started';
    var subject = document.createElement('input');
    var content = document.createElement('textarea');
    var submit = document.createElement('span');
    submit.innerHTML = 'Submit';

    subject.setAttribute('type', 'text');
    subject.setAttribute('name', 'question-subject');
    subject.setAttribute('id', 'question-subject');
    subject.setAttribute('placeholder', 'Subject');

    content.setAttribute('id', 'question-content');
    content.setAttribute('placeholder', 'Question');

    submit.setAttribute('id', 'submit-btn');
    submit.setAttribute('class', 'btn');

    rightPaneNode.appendChild(welcome);
    rightPaneNode.appendChild(subHead);
    rightPaneNode.appendChild(subject);
    rightPaneNode.appendChild(content);
    rightPaneNode.appendChild(submit);

    submitEL();
}

function showResolveDiv(question) {
    clearChildren(rightPaneNode);
    var resolveContainer = document.createElement('div');
    var resolveHeader = document.createElement('h2');
    resolveHeader.innerHTML = 'Question';
    var resolveDetails = document.createElement('div');
    var title = document.createElement('h2');
    title.innerHTML = question.subject;
    var content = document.createElement('h6');
    content.innerHTML = question.content;
    var resolveBtn = document.createElement('span');
    resolveBtn.innerHTML = 'Resolve';

    resolveContainer.setAttribute('class', 'resolve-container');
    resolveHeader.setAttribute('class', 'question-header');
    resolveDetails.setAttribute('class', 'resolve-details');
    title.setAttribute('class', 'resolve-title');
    content.setAttribute('class', 'resolve-content');
    resolveBtn.setAttribute('class', 'btn resolve-btn');

    resolveBtn.addEventListener('click', async function() {
        var questions = await fetch(`${URL}/getQuestions`);
        questions = questions.json();

        let questionIndex = -1;
        for (var i = 0; i < questions.length; i++) {
            if (questions[i].title === question.title) {
                questionIndex = i;
                break;
            }
        }

        await fetch(`${URL}/resolveQuestion/${questionIndex}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        clearChildren(rightPaneNode);
        loadQuestions('');
        loadQuestionForm();
    });

    resolveContainer.appendChild(resolveHeader);
    resolveDetails.appendChild(title);
    resolveDetails.appendChild(content);
    resolveContainer.appendChild(resolveDetails);
    resolveContainer.appendChild(resolveBtn);
    rightPaneNode.appendChild(resolveContainer);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    loadQuestions('');
    loadQuestionForm();
});

function submitEL() {
    questionSubjectNode = document.getElementById('question-subject');
    questionContentNode = document.getElementById('question-content');
    submitButtonNode = document.getElementById('submit-btn');
    submitButtonNode.addEventListener('click', async function() {
        var question = {};
        question.subject = questionSubjectNode.value;
        question.content = questionContentNode.value;
        question.comments = [];
        
        await fetch(`${URL}/addQuestion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(question)
        });

        clearChildren(questionContainerNode);
        loadQuestions('');
    });
}

newQuestionBtn.addEventListener('click', function() {
    clearChildren(rightPaneNode);
    loadQuestionForm();
});

searchBox.addEventListener('input', function(event) {
    clearChildren(questionContainerNode);
    loadQuestions(event.target.value);
});