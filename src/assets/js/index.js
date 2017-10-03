import '../styles/index.scss';

if (document.getElementById('close')) {
  document.getElementById('close').addEventListener('click', () => {
    const error = document.getElementById('error_message');
    const body = document.getElementsByTagName('BODY')[0];
    error.className += ' hidden';
    setTimeout(() => body.removeChild(error), 700);
  });
}
