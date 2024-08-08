function getCancelButton() {
    return document.querySelector('[data-testid="comment-save-button"] + button');
}

/**
 * @param {Event} ev
 * @returns {boolean}
 */
function promptHandler(ev) {
    ev.preventDefault();

    const response = confirm('Are you sure you want to cancel? You will loose your data.')

    if (!response) {
        ev.stopImmediatePropagation();
        ev.stopPropagation();
        return false;
    }

    return true;
}

function registerCancelButtonListener() {
  const cancelButton = getCancelButton();

  // if the button already exists, we add the listener on it.
  if (cancelButton) {
    console.log('adding event handler on comment button')
    cancelButton.addEventListener('click', promptHandler)
  }
}

(function () {
    console.log('starting jira_cancel_button_prompt')

  registerCancelButtonListener();

    const commentBox = document.querySelector('[data-testid="issue.activity.comment"]');

    if (commentBox) {
      console.log('adding mutation observer on comment box')
      const commentBoxMutationObserver = new MutationObserver(registerCancelButtonListener)

      commentBoxMutationObserver.observe(commentBox, { childList: true, subtree: true })
    }
})();
