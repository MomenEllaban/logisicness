const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

function joinUsFormHandler(e) {
  e.preventDefault();
  [...e.target.querySelectorAll("button")].forEach((btn) => {
    btn.disabled = true;
    btn.type === "submit" && btn.classList.add("submitting");
  });
  const enableFormBtns = () => {
    [...e.target.querySelectorAll("button")].forEach((btn) => {
      btn.disabled = false;
      btn.type === "submit" && btn.classList.remove("submitting");
    });
  };
  const formData = new FormData(e.target);
  const file = formData.get("resume");

  storage
    .ref()
    .child("PDFcv")
    .child(file.name)
    .put(file)
    .on(
      "state_changed",
      (snapshot) => {
        uploadedFileName = snapshot.ref.name;
      },
      (error) => {
        console.log(error);
        enableFormBtns();
      },
      () => {
        storage
          .ref("PDFcv")
          .child(uploadedFileName)
          .getDownloadURL()
          .then((url) => {
            // sent to email
            (function () {
              emailjs.init({
                publicKey: emailJSKeys.publicKey,
              });
            })();
            emailjs
              .send(emailJSKeys.serviceKey, emailJSKeys.templateKey, {
                name: formData.get("name"),
                email: formData.get("email"),
                phone: formData.get("phone"),
                url,
              })
              .then((res) => {
                enableFormBtns();
                e.target.reset();
                e.target.querySelector('#message').innerHTML = "Send Successfully";
                setTimeout(() => {
                  e.target.querySelector('#message').innerHTML = "&nbsp;";
                }, 2000);
              })
              .catch();
          });
      }
    );
}

function toggleNavbarStyle() {
  // Make the navbar sticky and change color on scroll
  const navbar = document.querySelector(".navbar");

  // comment bellow
  const navbarBrandSVG = document.querySelector(".navbar .navbar-brand>img");
  if (scrollY > 170) {
    navbar.classList.remove("navbar-transparent");
    navbar.classList.add("navbar-sticky");
    navbar.classList.remove("nav-colored");
    // navbarBrandSVG.setAttribute("viewBox", "0 0 1831 515");
    navbarBrandSVG.setAttribute("viewBox", "280 515 1400 380");
    document.querySelector('.navbar-brand .logo_body').classList.remove('hidden')
    document.querySelector('.navbar-brand .logo_home').classList.add('hidden')
  } else {
    navbar.classList.remove("navbar-sticky");
    navbar.classList.add("navbar-transparent");
    navbar.classList.add("nav-colored");
    navbarBrandSVG.setAttribute("viewBox", "0 0 1855 870");
    document.querySelector('.navbar-brand .logo_body').classList.add('hidden')
    document.querySelector('.navbar-brand .logo_home').classList.remove('hidden')
  }

  //alternate
  // navbar.classList.remove("navbar-transparent");
  // navbar.classList.add("navbar-sticky");
}







/////////////////////////////////////////////////////////////////////////////
////////////////////////// START EVENT LISTENERS ////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function applyStyles() {
    setTimeout(() => {
      const navbCollapse = document.querySelector('.navbar-collapse.collapse');
      if (navbCollapse) {
        if (window.matchMedia('(max-width: 991px)').matches && navbCollapse.classList.contains('show')) {
          navbCollapse.closest('.navbar').classList.add('nav-colored');
        } else {
          navbCollapse.closest('.navbar').classList.remove('nav-colored');
        }
      }
    }, 380);
}
addEventListener("load", () => {
  // addEventListener("DOMContentLoaded", () => {

  applyStyles();
  addEventListener('resize', applyStyles);
  
  toggleNavbarStyle();
  // toggleNavbarlog();
  addEventListener("scroll", () => {
    toggleNavbarStyle();

    // show or hide the (TO-TOP) arrow
    document.querySelector(".back-to-top").className = `back-to-top ${window.scrollY > 300 ? "show" : ""}`;

    //Active section
    const navbarListItems = document.querySelectorAll("ul#custom-nav-links > li.nav-item> .nav-link");
    let currentSection;
    document.querySelectorAll('section').forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      section.classList.remove("active");
      if (scrollY >= (sectionTop - sectionHeight / 3)) currentSection = section;
    });
    if (currentSection != undefined) {
      navbarListItems.forEach((item) => {
        currentSection.classList.add("active");
        item.classList.remove("active");
        if ('#' + currentSection.id === item.dataset.section) {
          item.classList.add("active");
        }
        if (currentSection.id === '') {
          navbarListItems[0].classList.add("active");
        }
      });
    } else {
      navbarListItems.forEach((item) => item.classList.remove("active"));
    }
  });

  // 
  document.querySelectorAll('#custom-nav-links .nav-link').forEach(navLink => {
    navLink.addEventListener('click', () => {
      document.querySelector('.navbar-collapse.collapse').classList.remove('show');
      window.scrollBy(0, document.querySelector(navLink.dataset.section).getBoundingClientRect().top - 80);
    })
  })

  // move to the next section arrow on the header
  document
    .querySelector("#scroll-down")
    .addEventListener("click", () =>
      window.scrollBy(0, window.innerHeight - window.scrollY - 58)
    );

  try {
    setTimeout(() => {
      document.querySelector('.loader-overlay').style.opacity = 0;  
    }, 1000);

    setTimeout(() => {
        document.querySelector('.loader-overlay').style.display = 'none';
    }, 2000);
    // document.querySelector('.loader').style.opacity = 0;
    // setTimeout(() => {
    //   document.querySelector('.loader').style.display = 'none';
    // }, 5000);
  } catch (error) { }

});