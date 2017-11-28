(function () {
	function getQueryVariable(variable) {
		var query = window.location.search.substring(1),
			vars = query.split("&amp;");

		for (var i = 0; i &lt; vars.length; i++) {
			var pair = vars[i].split("=");

			if (pair[0] === variable) {
				return pair[1];
			}
		}
	}

	function getPreview(query, content, previewLength) {
		previewLength = previewLength || (content.length * 2);

		var parts = query.split(" "),
			match = content.toLowerCase().indexOf(query.toLowerCase()),
			matchLength = query.length,
			preview;

		// Find a relevant location in content
		for (var i = 0; i &lt; parts.length; i++) {
			if (match &gt;= 0) {
				break;
			}

			match = content.toLowerCase().indexOf(parts[i].toLowerCase());
			matchLength = parts[i].length;
		}

		// Create preview
		if (match &gt;= 0) {
			var start = match - (previewLength / 2),
				end = start &gt; 0 ? match + matchLength + (previewLength / 2) : previewLength;

			preview = content.substring(start, end).trim();

			if (start &gt; 0) {
				preview = "..." + preview;
			}

			if (end &lt; content.length) {
				preview = preview + "...";
			}

			// Highlight query parts
			preview = preview.replace(new RegExp("(" + parts.join("|") + ")", "gi"), "<strong>$1</strong>");
		} else {
			// Use start of content if no match found
			preview = content.substring(0, previewLength).trim() + (content.length &gt; previewLength ? "..." : "");
		}

		return preview;
	}

	function displaySearchResults(results, query) {
		var searchResultsEl = document.getElementById("search-results"),
			searchProcessEl = document.getElementById("search-process");

		if (results.length) {
			var resultsHTML = "";
			results.forEach(function (result) {
				var item = window.data[result.ref],
					contentPreview = getPreview(query, item.content, 170),
					titlePreview = getPreview(query, item.title);

				resultsHTML += "<li>
<h4><a href="/%22%20+%20item.url.trim()%20+%20%22">" + titlePreview + "</a></h4>
<p><small>" + contentPreview + "</small></p>
</li>";
			});

			searchResultsEl.innerHTML = resultsHTML;
			searchProcessEl.innerText = "Sonuç gösteriliyor..";
		} else {
			searchResultsEl.style.display = "none";
			searchProcessEl.innerText = ""; // Sonuç bulunamadı
		}
	}

	window.index = lunr(function () {
		this.field("id");
		this.field("title", {boost: 10});
		this.field("categories");
		this.field("url");
		this.field("content");
	});

	var query = decodeURIComponent((getQueryVariable("q") || "").replace(/\+/g, "%20")),
		searchQueryContainerEl = document.getElementById("search-query-container"),
		searchQueryEl = document.getElementById("search-query");

	searchQueryEl.innerText = query;
	searchQueryContainerEl.style.display = "inline";

	for (var key in window.data) {
		window.index.add(window.data[key]);
	}

	displaySearchResults(window.index.search(query), query); // Hand the results off to be displayed
})();
