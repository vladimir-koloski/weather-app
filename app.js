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
    hourlyElement: document.querySelector(".page.hourly"),
    statisticsResult: document.querySelector("#statisticsResult")
  }


};

document.getElementById("hourlyLink").addEventListener('click', function(){
  getWheaterInfo();
})

document.getElementById("loadStatistics").addEventListener('click', function(){
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
                loadStatistics(data.list, navService.htmlElements.statisticsResult);
                
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
  <td>Icon</td>
  <td>Temperature (C)</td>
  <td>Humidity (%)</td>
  <td>Wind Speed (m/s)</td>`
  table.appendChild(thead);  
  createRow(data, table)
}

let createRow = (data, el) => {
  for (let i = 0; i < data.length; i++){
    let tr = document.createElement('tr')
    tr.innerHTML = `<td> ${new Date(data[i].dt*1000).toLocaleString()}</td>
    <td> ${data[i].weather[0].description}</td>
    <td> <img src = "http://openweathermap.org/img/w/${data[i].weather[0].icon}.png"></td>
    <td> ${data[i].main.temp}</td>
    <td> ${data[i].main.humidity}</td>
    <td> ${data[i].wind.speed}</td>`
    el.appendChild(tr);
  }
}

function calculateStatistics(data){
  let temperatureSum = 0;
  let highestTemp = data.list[0];
  let lowestTemp = data.list[0];
  let humiditySum = 0;
  let highestHumd = data.list[0]
  let lowestHumd = data.list[0]
  for(const item of data.list){
    temperatureSum += item.main.temp
    humiditySum += item.main.humidity

    if(highestTemp.main.temp < item.main.temp){
      highestTemp = item;
    }
    if(lowestTemp.main.temp > item.main.temp){
      lowestTemp = item
    }
    if(highestHumd.main.temp < item.main.humidity){
      highestHumd = item
    }
    if(lowestHumd.main.temp > item.main.humidity){
      lowestHumd = item
    }

    return{
      temperature:{
      max: highestTemp.main.temp,
      min: lowestTemp.main.temp,
      avg: temperatureSum / data.list.length
      },

      humidity:{
      max: highestHumd.main.temp,
      min: lowestHumd.main.temp,
      avg: humiditySum / data.list.length
      },

      warmestTime: new Date(highestTemp.dt * 1000),
      coldestTime: new Date(lowestTemp.dt * 1000)      

    }
  }
}




function loadStatistics(data, el){
  let statisticsResult = document.getElementById('statisticsResult');
  const s = calculateStatistics(data)
  el.innerHTML = '';
  el.innerHTML = `
  <div>Higher temperature ${s.temperature.max}</div>
  <div>Lower temperature ${s.temperature.min}</div>
  <div>Averege temperature ${s.temperature.avg}</div>
  `
  el.appendChild(statisticsResult)
}





