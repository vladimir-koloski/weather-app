let navService = {
  $navItems: $(".nav-item"),
  $pages: $("#pages").children(),
  activateItem: function($item) {
      this.$navItems.removeClass("active");
      $item.addClass("active");
  },
  showPage: function($page) {
      this.$pages.css("display", "none");
      $page.css("display", "block");
  },
  registerNavListeners: function() {
      this.$navItems.each(function (index, element) {
         $(element).on('click', function () {
              navService.activateItem($(this));
              navService.showPage(navService.$pages.eq(index));
         });
      });
  },
  htmlElements: {
    hourlyElement: document.querySelector(".page.hourly")
  }
};

document.getElementById("hourlyLink").addEventListener('click', function(){
  getWheaterInfo();
})




navService.registerNavListeners()

function  getWheaterInfo(){
        $.ajax({
            url:"http://api.openweathermap.org/data/2.5/forecast?q=Skopje,MK&appid=4b978d800c24f75a79cb51e24bf932a6&units=metric",
            success: function(data) {
                // let result = (JSON.parse(data));
                console.log(data);
                createTable(data.list, navService.htmlElements.hourlyElement);
            },
            error: function(error) {
                console.log(error);
            }
        })
      }


let createTable = (data, el) => {
let table = document.createElement('table');

  table.setAttribute('border', '1');
  console.log(el);
  el.appendChild(table);
  let thead = document.createElement('thead')
  thead.innerHTML = `<td>Date and Time</td>
  <td>Wheater Desc.</td>
  <td>Temperature (C)</td>
  <td>Humidity (%)</td>
  <td>Wind Speed (m/s)</td>`
  table.appendChild(thead);  
  createRow(data, table)
}

let createRow = (data, el) => {
  for (let i = 0; i < data.length; i++){
    let tr = document.createElement('tr')
    tr.innerHTML = `<td> ${new Date(data[i].dt*1000)}</td>
    <td> ${data[i].weather[0].description}</td>
    <td> ${data[i].main.temp}</td>
    <td> ${data[i].main.humidity}</td>
    <td> ${data[i].wind.speed}</td>`
    el.appendChild(tr);
  }
}


