document.getElementById('click').onclick = function() {
  // document.getElementById('hide').style.visibility = 'hidden'
  document.getElementById('table').style.display = 'none'
}

document.getElementById('show').onclick = function() {
  // document.getElementById('hide').style.visibility = ''
  document.getElementById('table').style.display = ''
}

for (var i = 1 ; i < 21 ; i++) {
  var newrow = document.createElement('DIV')
  newrow.innerHTML = i
  document.getElementById('table').appendChild(newrow)
}

var picdiv = document.getElementById('under')
for (var i = 0 ; i < 10 ; i++) {
  var newpic = document.createElement('DIV')
  newpic.innerHTML = '<a class="pics">s<img src="" /><a/>'
  picdiv.appendChild(newpic)
}