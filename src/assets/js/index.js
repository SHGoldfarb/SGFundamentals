import '../styles/index.scss';

function closeError() {
  const error = document.getElementById('error_message');
  const body = document.getElementsByTagName('BODY')[0];
  error.classList.add('hidden');
}

if (document.getElementById('close')) {
  document.getElementById('close').addEventListener('click', closeError);
}
