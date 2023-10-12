
// JavaScript code to add interactivity and modern design elements

document.addEventListener("DOMContentLoaded", function() {

    // Smooth scrolling for all links
    const links = document.querySelectorAll("a[href^='#']");
    for (const link of links) {
        link.addEventListener("click", smoothScroll);
    }

    function smoothScroll(event) {
        event.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);
        window.scrollTo({
            top: targetElement.offsetTop,
            behavior: "smooth"
        });
    }

    // Dynamic loading of items
    const experienceItems = document.querySelectorAll(".experience-item");
    const skillItems = document.querySelectorAll("#skills ul li");
    const projectItems = document.querySelectorAll("#projects ul li");

    function showItemsOnScroll(items) {
        const triggerBottom = (window.innerHeight / 5) * 4;
        items.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            if (itemTop < triggerBottom) {
                item.classList.add("active");
            }
        });
    }

    // Initial call to display items that are already in view
    showItemsOnScroll(experienceItems);
    showItemsOnScroll(skillItems);
    showItemsOnScroll(projectItems);

    // Add scroll event listener
    window.addEventListener("scroll", () => {
        showItemsOnScroll(experienceItems);
        showItemsOnScroll(skillItems);
        showItemsOnScroll(projectItems);
    });

});
