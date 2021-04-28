const connectionSting = 'https://pixabay.com/api/?key=13758930-1d93593cd503dcde0b0b6f27b';
const picsPerPage = 100;

let userCollection = [];
let tempCollection = [];

setSelector(type);
setSelector(category);
setColorSelector(color);

$(function() {
  $('.button.search').on('click', function(){
    createGallery();
  });

  $('.gallery').on('click', '.checked', function() {
    let getID = $(this).attr('data-id');
    switchSelect(getID);
  });

  $('.gallery').on('click', 'img', function(event) {
    if(event.ctrlKey) {
      let getID = $(this).attr('data-id');
      switchSelect(getID);
    };
  });

  // === Open Modal Window -------------------------------
  $('.gallery').on('click', 'img', function(event) {
    if(!event.ctrlKey) {
      let id = $(this).attr('data-id');
      userCollection.map(item => {
        if(item.id == id) {
          let source = item.view;
          let type = item.type;
          let size_wh = item.download_W +'x'+ item.download_H;
          let download = item.download;
          let vol = item.size;
          let url = item.pageURL;
          if (item.select === true) {
            $('.modal-checked').css("color", "var(--activ-ext)");
          }
          else if (item.select === false) {
            $('.modal-checked').css("color", "var(--hover-base)");
          }
          $('.modal-public').attr({href: url});
          $('.modal-download').attr({href: download+'?attachment'});
          $('.modal-checked').attr({dataid: id});
          $('.modal-image').attr({src: source});
          $('.modal-fullview').attr({href: download});
          $('.modal-type').text(type);
          $('.modal-dimension').text(size_wh);
          $('.modal-size').text((vol/1048576).toFixed(2) + ' Mb');
        }
      });
      $('.modal').css({opacity: 0, display: 'flex'}).animate({
        opacity: 1
      }, 250);
      $('body').css({overflow: 'hidden'});
    };
  });
});

//--- Gallery Control ----------------------------------------------------
function createGallery() {
    let searchStr = '&q=' + $('.gl-search').val();
    let typeStr = '&image_type=' + $('.typeSelector').val().join('+');
    let categoryStr = '&category=' + $('.categorySelector').val().join('+');
    let colorStr = '&colors=' + getColorsSelect().join('+');
    let queryStr = connectionSting + searchStr + typeStr + categoryStr + colorStr + "&per_page=" + picsPerPage;
    $('.gallery').empty();
    $(`.ext-panel`).slideUp(200);
    createLocalJSON(queryStr);
};

function createLocalJSON(url) {
  data = [];
  fetch(url)
    .then(responce => responce.json())
    .then(source => {
      source.hits.map(item => {
        let tempDownload;
        if (item.type === 'vector/svg') {
          tempDownload = setDownloadURL(item.previewURL);
        }
        else {
          tempDownload = item.largeImageURL
        }
        data.push({
          id:   item.id,
          type: item.type,
          select: false,
          pageURL:    item.pageURL,
          preview:    item.previewURL,
          preview_W:  item.previewWidth,
          preview_H:  item.previewHeight,
          view:       item.webformatURL,
          view_W:     item.webformatWidth,
          view_H:     item.webformatHeight,
          download:   tempDownload,
          download_W: item.imageWidth,
          download_H: item.imageHeight,
          size:       item.imageSize,
      });
    });
  })
  .then(() => setPictureCollection(data))
  .then(userCollection = data)
  .catch(error => console.log(error));
};

function setPictureCollection(json) {
  json.map(item => {
    $('.gallery').append(`
      <div id="${item.id}" class="gallery-item">
        <img src="${item.preview}" data-id="${item.id}" alt="${item.type}"/>
        <div class="item-control">
            <span class="item-info" title="Image Type">${item.type}</span>
            <a class="button-small download  material-icons" href="${item.download}?attachment" download title="Download Image">cloud_download</a>
            <span class="button-small checked material-icons" data-id="${item.id}" title="Image Select">bookmark_border</span>
        </div>
      </div>
    `);
  });
};

function setDownloadURL(str) {
  let tmp = str.split('/')[str.split('/').length-1];
  let val = tmp.split('_')[0];
  let resault = `https://pixabay.com/images/download/${val}.svg`;
  return resault;
};

function switchSelect(id) {
  userCollection.map(item => {
    if(item.id == id) {
      if (item.select == true) {
        item.select = !item.select;
        $(`#${id}`).removeClass('selected');
        $(`#${id}`).find('.checked').removeClass('selected');
        $(`#${id}`).find('img').attr({'data-select': "false"});
        tempCollection.map(selectItem => {
          tempCollection = tempCollection.filter(item => item.id != selectItem.id)
        });
        $(`.${item.id}ci`).remove();
      }
      else {
        item.select = !item.select;
        $(`#${id}`).addClass('selected');
        $(`#${id}`).find('.checked').addClass('selected');
        $(`#${id}`).find('img').attr({'data-select': "true"});
        tempCollection.push(item);
        $('.selected-image').append(`
          <div class="selected-image-item ${item.id}ci"><img src="${item.preview}" alt="Pic"/></a></div>
        `);
      };
    };
  });
};

// --- Search Panel Control ---------------------------------------------------
  $('.button.filter').on('click', function() {
    $('.ext-panel').slideToggle(250);
  });

  $(document).on('keyup', function(event) {
    if (event.which == 27) {
      $('.ext-panel').slideUp(250);
    };
  });

  $(document).on('mouseup', function(event) {
    if (!$('.control').is(event.target)
        && !$('.control').has(event.target).length) {
      $('.ext-panel').slideUp(250);
    };
  });

  $(document).on('keyup', function(event) {
    if (event.which == 13) {
      $('.ext-panel').slideUp(250);
      createGallery();
    };
  });

function getColorsSelect() {
  let arr = [];
  $('.colorcheck:checked').each(function() {
    arr.push($(this).val());
  });
  return arr;
};

// TODO http://slimselectjs.com/

let typeSelector = new SlimSelect({
  select: '.typeSelector',
  placeholder: 'Select image type',
  showSearch: false,
});

let categorySelector = new SlimSelect({
  select: '.categorySelector',
  placeholder: 'Select image category',
  showSearch: false,
});
//______________________________

function setSelector(selector) {
  selector.forEach(item => {
    let deltaSelector = item.class;
    let deltaValue = item.value;
    $(`${deltaSelector}`).append(`
      <option class = "list-item img-type" value=${deltaValue}>${deltaValue}</option>
    `);
  });
};

function setColorSelector(selector) {
  selector.forEach(item => {
    let deltaSelector = item.class;
    let deltaValue = item.value;
    $(`${deltaSelector}`).append(`
      <div class = "chkbox">
        <input id=${deltaValue} class="colorcheck" type="checkbox" value=${deltaValue}>
        <span class="check"></span>
        <label class="material-icons" for=${deltaValue}><span class=${deltaValue}>circle</span></label>
      </div>
    `);
  });
};

//--- Modal Window Control ----------------------------------------------------
  $('.modal').on('click', '.modal-close', function(event) {
    event.preventDefault();
      $('.modal').fadeOut(250);
      $('body').css({overflow: 'auto'});
  });

  $('.modal').on('mouseup', function(event) {
    event.preventDefault();
    if (!$('.modal-content').is(event.target)
        && !$('.modal-content').has(event.target).length) {
      $('.modal').fadeOut(250);
      $('body').css({overflow: 'auto'});
    };
  });

  $('.modal').on('click', '.modal-checked', function() {
    let setID = $(this).attr('dataid');
    userCollection.map(item => {
      if(item.id == setID) {
        if (item.select == true) {
          item.select = !item.select;
          $('.modal-checked').css("color", "var(--hover-base)");
        }
        else {
          item.select = !item.select;
          $('.modal-checked').css("color", "var(--activ-ext)");
        };
      }
      switchSelect(setID);
    });
  });

  $('.new-collection').on('click', function() {
    tempCollection.length = 0;
    $('.selected-image').empty();
    userCollection.map(item => {
        if (item.select == true) {
          item.select = !item.select;
        }
        $(`#${item.id}`).removeClass('selected');
        $(`#${item.id}`).find('.checked').removeClass('selected');
    });
  });

  $('.save-collection').on('click', function() {
    saveCollection = tempCollection;
    localStorage.setItem('storageCollection', JSON.stringify(saveCollection));
  });

  $('.open-collection').on('click', function() {
    tempCollection = JSON.parse(localStorage.getItem("storageCollection"));
    $('.gallery').empty();
    $(function() {
      tempCollection.map(item => {
        $('.selected-image').append(`
          <div class="selected-image-item ${item.id}ci"><img src="${item.preview}" alt="Pic"/></a></div>
        `);
      });
      setPictureCollection(tempCollection)
    });
  });