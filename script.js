// Nur ein kurzer Ausschnitt als Platzhalter
function toggleStats() {
  const statsContainer = document.getElementById('statsContainer');
  statsContainer.style.display = statsContainer.style.display === 'none' ? 'flex' : 'none';
}

document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && ['u', 'c', 'x', 's'].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }
});

// Weitere Funktionen wie rollDice(), closeEffect(), saveEffects(), usw.
