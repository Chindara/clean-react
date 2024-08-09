// Publish project specific data
(function() {
rh = window.rh;
model = rh.model;
var defaultTopic = "First_Topic.htm";
rh._.exports(defaultTopic);
rh.consts('DEFAULT_TOPIC', encodeURI("First_Topic.htm"));
rh.consts('HOME_FILEPATH', encodeURI('index.htm'));
rh.consts('START_FILEPATH', encodeURI('index.htm'));
rh.consts('HELP_ID', 'b29fc5ad-9ccb-4957-959a-2f1592b9dd39' || 'preview');
rh.consts('LNG_SUBSTR_SEARCH', 0);

model.publish(rh.consts('KEY_LNG_NAME'), "en");
model.publish(rh.consts('KEY_DIR'), "ltr");
model.publish(rh.consts('KEY_LNG'), {"BreadcrumbStart":"Home:","BrsNextButton":"Next","BrsPrevButton":"Previous","CloseFavorites":"Close Favorites","ContentsTab":"Contents","CookiesAcceptText":"We ask you to accept cookies for performance, readability and experience purposes. Cookies are used for bookmarking favorite topics and to restore the table of contents, index and glossary on topic change. This setting is asked only once and can be reverted by clearing the browser cookies.","CookiesAcceptButton":"Accept","CookiesDenyButton":"Later","EditFavorites":"Edit Favorites","FavoriteArticle":"saved article","FavoriteArticles":"saved articles","Expand All":"Expand All","Filter":"Filter","Select Bookmark":"Select Bookmark","Download PDF":"Download PDF","Search":"Search","Share":"Share","Collapse All":"Collapse All","Remove Highlight":"Remove Highlight","Print":"Print","Favorites":"Favorites","FullScreenButton":"Full Screen","GlossaryTab":"Glossary","GlossResultHeaderLabel":"Glossary Dictionary","HideLeftPanelTip":"Hide Left Panel","HideResults":"Hide Results","HomeButton":"Home","HomePageLogoTitle":"Logo","HomePageSubtitle":"How can we help?","IndexTab":"Index","MCSearchResultShowFullTopic":"Read more...","MiniTOCCaption":"In this Topic","NoResultsFoundText":"No Results Found","PrintButtonTip":"Print","RemoveFavItem":"Remove ","RemoveHighlight":"Remove Highlight","ResultsFoundText":"%1 result(s) found for %2","SearchPlaceHolder":"Search...","IndexFilterKewords":"Find Keyword","GlossaryFilterTerms":"Find Term","SetAsFavorite":"Set as Favorite","ShowLeftPanelTip":"Show Left Panel","TOCTileArticlesCount":"article(s)","ToTopButtonTip":"Go to Top","UnsetAsFavorite":"Unset as Favorite","TopicHiddenText":"This topic is filtered out by the selected filters.","ResetFilters":"Reset Filters","SkipToMainContent":"Skip To Main Content","ClearSearchBox":"Clear Search Box","RemoveFilter":"Remove Filter","SelectedFilters":"Selected Filters","CloseSidebar":"Close Sidebar","OpenMenu":"Open Menu","CloseMenu":"Close Menu","ViewMore":"View More","SearchPaginationLabel":"%1 to %2 of %3 results","NextSearchResults":"Next search page","PrevSearchResults":"Previous search page"});

model.publish(rh.consts('KEY_HEADER_TITLE'), "eSIP | User Manual");
model.publish(rh.consts('PDF_FILE_NAME'), "");
model.publish(rh.consts('MAX_SEARCH_RESULTS'), "20");
model.publish(rh.consts('KEY_SKIN_FOLDER_NAME'), "Orange");
model.publish(rh.consts('CHAT_API_SESSION_TOKEN'), "");
model.publish(rh.consts('CHAT_API_PROJ_ID'), "");

model.publish(rh.consts('KEY_SUBSTR_SEARCH'), "");
model.publish(rh.consts('KEY_LOGO_URL'), "");
model.publish(rh.consts('KEY_SPECIAL_CHARS'), "0;1;2;3;4;5;6;7;8;9");
})();
