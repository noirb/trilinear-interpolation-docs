// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="how-to/index.html">How do I use this?</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="how-to/trilerp-materials.html">Trilinear Interpolation Materials</a></li><li class="chapter-item expanded "><a href="how-to/trilerp-mesh.html">Trilinear Interpolated Dynamic Meshes</a></li></ol></li><li class="chapter-item expanded "><a href="blueprint-api/index.html">Blueprint API Documentation</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="blueprint-api/classes/index.html">Classes</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="blueprint-api/classes/TrilerpMeshComponent.html">Trilerp Mesh Component</a></li></ol></li><li class="chapter-item expanded "><a href="blueprint-api/functions/index.html">Functions</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="blueprint-api/functions/TrilinearInterpolationMesh.html">Trilinear Interpolation (Mesh)</a></li><li class="chapter-item expanded "><a href="blueprint-api/functions/TrilinearInterpolationPoint.html">Trilinear Interpolation (Point)</a></li><li class="chapter-item expanded "><a href="blueprint-api/functions/TrilinearInterpolationVertices.html">Trilinear Interpolation (Vertices)</a></li></ol></li><li class="chapter-item expanded "><a href="blueprint-api/enums/index.html">Enums</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="blueprint-api/enums/EIncludeCollisionType.html">EIncludeCollisionType</a></li><li class="chapter-item expanded "><a href="blueprint-api/enums/ELatticeFace.html">ELatticeFace</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="reference.html">C++ API Reference</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="reference/enums.html">Enums</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="reference/enums/EIncludeCollisionType.html">EIncludeCollisionType</a></li><li class="chapter-item expanded "><a href="reference/enums/ELatticeFace.html">ELatticeFace</a></li></ol></li><li class="chapter-item expanded "><a href="reference/structs.html">Structs</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="reference/structs/HNBLatticeCornerProxy.html">HNBLatticeCornerProxy</a></li><li class="chapter-item expanded "><a href="reference/structs/HNBLatticeFaceProxy.html">HNBLatticeFaceProxy</a></li></ol></li><li class="chapter-item expanded "><a href="reference/classes.html">Classes</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="reference/classes/FNBTrilerpEditorModule.html">FNBTrilerpEditorModule</a></li><li class="chapter-item expanded "><a href="reference/classes/FNBTrilinearInterpolationModule.html">FNBTrilinearInterpolationModule</a></li><li class="chapter-item expanded "><a href="reference/classes/NBTrilinearVisualizer.html">NBTrilinearVisualizer</a></li><li class="chapter-item expanded "><a href="reference/classes/UNBTrilinearInterpolation.html">UNBTrilinearInterpolation</a></li><li class="chapter-item expanded "><a href="reference/classes/UNBTrilinearInterpolationBPLibrary.html">UNBTrilinearInterpolationBPLibrary</a></li><li class="chapter-item expanded "><a href="reference/classes/UTrilerpMeshComponent.html">UTrilerpMeshComponent</a></li></ol></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
