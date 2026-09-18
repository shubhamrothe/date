const form = document.querySelector('#date-form');
const formMessage = document.querySelector('#form-message');
const answerActions = document.querySelector('#answer-actions');
const yesButton = document.querySelector('#yes-button');
const noButton = document.querySelector('#no-button');
const planFields = document.querySelector('#plan-fields');
const dateInput = document.querySelector('#date');
const planSelect = document.querySelector('#plan');
const sceneFigure = document.querySelector('#date-scene');
const sceneImage = document.querySelector('#scene-image');
const sceneCaption = document.querySelector('#scene-caption');

// Set this to your deployed Google Apps Script or form-service endpoint.
const responseEndpoint = 'https://script.google.com/macros/s/AKfycbzZencwIkFvzbgwHZ4075UyDdbPJhlaVKhHxMIdqitE6ozXFsDNzj85hwnzC6dF9p2O/exec';

const scenes = {
  coffee: {
    image: 'coffee-date.svg',
    alt: 'Two people sharing a romantic evening coffee together',
    caption: 'two hearts, one cozy coffee evening'
  },
  dinner: {
    image: 'dinner-date.svg',
    alt: 'Two people enjoying a romantic dinner together',
    caption: 'a candlelit dinner made for two'
  }
};

const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .split('T')[0];
dateInput.min = localDate;
dateInput.value = localDate;

planSelect.addEventListener('change', () => {
  const selectedScene = scenes[planSelect.value];
  if (!selectedScene) {
    return;
  }

  sceneImage.src = selectedScene.image;
  sceneImage.alt = selectedScene.alt;
  sceneCaption.textContent = selectedScene.caption;
  sceneFigure.hidden = false;
});

yesButton.addEventListener('click', () => {
  answerActions.hidden = true;
  planFields.hidden = false;
  formMessage.textContent = 'Yay! Now let’s choose the perfect plan. ☕';
});

const moveNoButton = () => {
  const bounds = answerActions.getBoundingClientRect();
  const maxX = Math.max(0, bounds.width - noButton.offsetWidth);
  const maxY = Math.max(0, bounds.height - noButton.offsetHeight);
  noButton.style.position = 'absolute';
  noButton.style.left = `${Math.random() * maxX}px`;
  noButton.style.top = `${Math.random() * maxY}px`;
  formMessage.textContent = 'Hmm, that button seems to be feeling shy. Try again?';
};

noButton.addEventListener('mouseenter', moveNoButton);
noButton.addEventListener('touchstart', (event) => {
  event.preventDefault();
  moveNoButton();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.elements.plan.value) {
    formMessage.textContent = 'Before we make a plan, choose what you would enjoy: coffee or dinner. ♥';
    form.elements.plan.focus();
    return;
  }

  if (!form.elements.date.value) {
    formMessage.textContent = 'Every lovely date needs a day. When would be a good day for you? ♥';
    form.elements.date.focus();
    return;
  }

  if (!form.elements.time.value) {
    formMessage.textContent = 'A lovely date needs a time too. What time would suit you best? ♥';
    form.elements.time.focus();
    return;
  }

  const date = new Date(`${form.elements.date.value}T${form.elements.time.value}`);
  const day = date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const plan = form.elements.plan.value;
  const response = {
    plan,
    date: form.elements.date.value,
    time: form.elements.time.value,
    submittedAt: new Date().toISOString()
  };

  if (!responseEndpoint) {
    formMessage.textContent = `It’s a plan! ${plan} on ${day} at ${time}. Add a response endpoint to receive this answer. ♥`;
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  formMessage.textContent = 'Saving your lovely plan...';

  try {
    await fetch(responseEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response),
      mode: 'no-cors'
    });
    formMessage.textContent = `It’s a plan! ${plan} on ${day} at ${time}. I’m looking forward to it. ♥`;
  } catch (error) {
    formMessage.textContent = 'The plan could not be saved. Please try submitting once more.';
    submitButton.disabled = false;
  }
});
