import PFElement from "../../pfelement/dist/pfelement.js";

class PfeJumpLinks extends PFElement {
  static get tag() {
    return "pfe-jump-links";
  }

  get schemaUrl() {
    return "pfe-jump-links.json";
  }

  get templateUrl() {
    return "pfe-jump-links.html";
  }

  get styleUrl() {
    return "pfe-jump-links.scss";
  }

  // static get events() {
  //   return {
  //   };
  // }

  // Declare the type of this component
  static get PfeType() {
    return PFElement.PfeTypes.Content;
  }

  // static get observedAttributes() {
  //   return [];
  // }

  constructor() {
    super(PfeJumpLinks, { type: PfeJumpLinks.PfeType });
  }

  connectedCallback() {
    super.connectedCallback();
    // If you need to initialize any attributes, do that here
  }

  disconnectedCallback() {}
}

const parentObserverConfig = {
  childList: true
};

const externalBtnObserverConfig = {
  characterData: true,
  attributes: true,
  subtree: true,
  childList: true
};

class PfeJumpLinksNav extends PFElement {
  static get tag() {
    return "pfe-jump-links-nav";
  }

  get schemaUrl() {
    return "pfe-jump-links-nav.json";
  }

  get templateUrl() {
    return "pfe-jump-links-nav.html";
  }

  get styleUrl() {
    return "pfe-jump-links-nav.scss";
  }

  // static get events() {
  //   return {
  //   };
  // }

  // Declare the type of this component
  static get PfeType() {
    return PFElement.PfeTypes.Content;
  }

  // static get observedAttributes() {
  //   return [];
  // }

  constructor() {
    super(PfeJumpLinksNav, { type: PfeJumpLinksNav.PfeType });

    console.log("bleep bloop");
    this._mutationCallback = this._mutationCallback.bind(this);
    this._menuContainer = this.shadowRoot.querySelector("#container");
    this._observer = new MutationObserver(this._mutationCallback);
  }

  connectedCallback() {
    super.connectedCallback();
    // If you need to initialize any attributes, do that here

    //Check that the light DOM is there
    if (this.hasAttribute("autobuild")) {
      this._buildNav();
    } else {
      //Check that the light DOM is valid
      if (this._isValidLightDom()) {
        const menu = this.querySelector("ul");
        this._menuContainer.innerHTML = menu.outerHTML;
      }
    }

    this._observer.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });
  }

  disconnectedCallback() {
    this.removeEventListener("click");
  }

  _buildNav() {
    let html = "";
    console.log("...in progress!");
    html += `<h2 hidden id="site-nav-heading" class="sr-only">Page navigation</h2>`;
    html += `<h4 class="heading" slot="heading">Jump to section</h4>`;
    html += `<ul class="pfe-jump-links-nav">`;
    console.log(this.id);
    let panel = document.querySelector(`[scrolltarget="${this.id}"]`);
    let panelSections = panel.querySelectorAll(
      ".pfe-jump-links-panel__section"
    );
    // console.log(panel)
    // console.log(panelSections);
    let isSubSection = false;

    for (let i = 0; i < panelSections.length; i++) {
      let arr = [...panelSections];
      if (arr[i].classList.contains("has-sub-section")) {
        isSubSection = true;
        let linkListItem = `
          <li>
            <a
              class="pfe-jump-links-nav__item has-sub-section"
              href="#${arr[i].id}"
              data-target="${arr[i].id}">
                ${arr[i].innerHTML}
            </a>
            <ul class="sub-nav">
        `;
        html += linkListItem;
      } else if (arr[i].classList.contains("sub-section")) {
        let linkSubItem = `
        <li>
            <a
              class="pfe-jump-links-nav__item sub-section"
              href="#${arr[i].id}"
              data-target="${arr[i].id}">
                ${arr[i].innerHTML}
            </a>
        </li>`;
        if (!arr[i + 1].classList.contains("sub-section")) {
          linkSubItem += `</ul></li>`;
        }
        html += linkSubItem;
      } else {
        let linkListItem = `
          <li>
            <a
              class="pfe-jump-links-nav__item"
              href="#${arr[i].id}"
              data-target="${arr[i].id}">
                ${arr[i].innerHTML}
            </a>
          </li>
        `;
        html += linkListItem;
      }
    }
    this.shadowRoot.querySelector("#container").innerHTML = html;
  }

  _mutationCallback() {
    console.log("mutations");
    const menu = this.querySelector("ul");
    this._menuContainer.innerHTML = menu.outerHTML;
  }

  _isValidLightDom() {
    if (!this.children.length) {
      console.warn(
        `${PfeJumpLinks.tag}: You must have a <ul> tag in the light DOM`
      );
      return false;
    }

    if (this.children[1].tagName !== "UL") {
      console.warn(
        `${PfeJumpLinks.tag}: The top-level html tag MUST be a <ul>`
      );

      return false;
    }

    return true;
  }
}

class PfeJumpLinksPanel extends PFElement {
  static get tag() {
    return "pfe-jump-links-panel";
  }

  get schemaUrl() {
    return "pfe-jump-links-panel.json";
  }

  get templateUrl() {
    return "pfe-jump-links-panel.html";
  }

  get styleUrl() {
    return "pfe-jump-links-panel.scss";
  }

  // static get events() {
  //   return {
  //   };
  // }

  // Declare the type of this component
  static get PfeType() {
    return PFElement.PfeTypes.Content;
  }

  // static get observedAttributes() {
  //   return [];
  // }

  constructor() {
    super(PfeJumpLinksPanel, { type: PfeJumpLinksPanel.PfeType });
    this._init = this._init.bind(this);
    this._slot = this.shadowRoot.querySelector("slot");
    this._slot.addEventListener("slotchange", this._init);
    this._scrollCallback = this._scrollCallback.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    this._init();

    window.addEventListener("scroll", this._scrollCallback);
    // If you need to initialize any attributes, do that here
  }

  disconnectedCallback() {
    window.removeEventListener("scroll");
    this._slot.removeEventListener("slotchange", this._init);
  }

  _init() {
    this.scrollTarget = this.getAttribute("scrolltarget");
    this.JumpLinksNav = document.querySelector(`#${this.scrollTarget}`);
    this.sections = this.querySelectorAll(".pfe-jump-links-panel__section");
    if (this.JumpLinksNav) {
      this.menu_links = this.JumpLinksNav.querySelectorAll(
        ".pfe-jump-links-nav__item"
      );
    }
    this.makeActive = link => {
      if (this.menu_links[link]) {
        // Check if this is a subnav or has subsections
        if (this.menu_links[link].classList.contains("sub-section")) {
          this.menu_links[link].setAttribute("active", "");
          this.menu_links[link].parentNode.parentNode.parentNode.setAttribute(
            "active",
            ""
          );
          this.menu_links[link].parentNode.parentNode.parentNode.classList.add(
            "expand"
          );
        } else if (
          this.menu_links[link].classList.contains("has-sub-section")
        ) {
          this.menu_links[link].setAttribute("active", "");
          this.menu_links[link].parentNode.setAttribute("active", "");
          this.menu_links[link].parentNode.classList.add("expand");
        } else {
          this.menu_links[link].setAttribute("active", "");
          this.menu_links[link].parentNode.setAttribute("active", "");
        }
        let activeLink = this.JumpLinksNav.querySelector("[active]");
        this.dispatchEvent(
          new CustomEvent(`pfe-jump-links-panel:active-nav-item`, {
            detail: {
              activeNavItem: activeLink
            },
            bubbles: true
          })
        );
      }
    };
    this.removeActive = link => {
      if (this.menu_links[link]) {
        //@TODO Should add logic here that doesn't remove active attribute
        // when ones of its children is the active link

        if (this.menu_links[link].classList.contains("sub-section")) {
          this.menu_links[
            link
          ].parentNode.parentNode.parentNode.classList.remove("expand");
        }
        this.menu_links[link].removeAttribute("active");
        this.menu_links[link].parentNode.removeAttribute("active");
      }
    };
    this.removeAllActive = () =>
      [...Array(this.sections.length).keys()].forEach(link => {
        this.removeActive(link);
      });

    this.sectionMargin = 200;

    this.currentActive = 0;
  }
  _scrollCallback() {
    let sections;
    let menu_links;
    let sectionMargin;

    if (!this.sections || typeof this.sections === "undefined") {
      this.sections = this.querySelectorAll(".pfe-jump-links-panel__section");
    } else {
      sections = this.sections;
    }

    if (this.menu_links.length < 1 || !this.menu_links) {
      this.menu_links = this.JumpLinksNav.shadowRoot.querySelectorAll(
        ".pfe-jump-links-nav__item"
      );
      menu_links = this.menu_links;
      console.log(this.menu_links);
    }
    if (!this.sectionMargin) {
      sectionMargin = 200;
    } else {
      sectionMargin = this.sectionMargin;
    }
    const sectionArr = [...sections];
    const matches = sectionArr
      .filter(section => window.scrollY >= section.offsetTop - sectionMargin)
      .reverse();
    const current = sectionArr.indexOf(matches[0]);
    if (current !== this.currentActive) {
      this.removeAllActive();
      this.currentActive = current;
      this.makeActive(current);
    }
  }
}

PFElement.create(PfeJumpLinks);
PFElement.create(PfeJumpLinksNav);
PFElement.create(PfeJumpLinksPanel);

export default PfeJumpLinks;
