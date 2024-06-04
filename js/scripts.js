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

/////////////////////////////////////////////////////////////////////////////
////////////////////////// START EVENT LISTENERS ////////////////////////////
/////////////////////////////////////////////////////////////////////////////

addEventListener("DOMContentLoaded", () => {
    addEventListener("scroll", () => {
      // Make the navbar sticky and change color on scroll
      const navbar = document.querySelector(".navbar");
    
      // comment bellow
      const navbarBrandSVG = document.querySelector(".navbar .navbar-brand>svg");
      if (scrollY > 170) {
        navbar.classList.remove("navbar-transparent");
        navbar.classList.add("navbar-sticky");
        // navbarBrandSVG.setAttribute("viewBox", "0 0 1831 515");
        navbarBrandSVG.setAttribute("viewBox", "280 515 1400 380");
      } else {
        navbar.classList.remove("navbar-sticky");
        navbar.classList.add("navbar-transparent");
        navbarBrandSVG.setAttribute("viewBox", "0 0 1855 870");
      }
    
      //alternate
      // navbar.classList.remove("navbar-transparent");
      // navbar.classList.add("navbar-sticky");
    
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
        document.querySelector('.navbar-toggler').click();
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
      document.querySelector('.loader').style.opacity = 0;
      setTimeout(() => {
          document.querySelector('.loader').style.display = 'none';
      }, 5000);
    } catch (error) {}
    
});