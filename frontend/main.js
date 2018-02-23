const ENDP = "http://localhost:5000/reach/";
const WAIT = 10000;

$(document).ready(function() {

  function hideInputForm() {$("#basefs-form-one").hide();};
  function hideInputMessage() {$("#basefs-message-one").hide()};
  function hideOutputForm() {$("#basefs-form-two").hide()};
  function hideOutputMessage() {$("#basefs-message-two").hide()};
  function showInputForm() {$("#basefs-form-one").show();};
  function showInputMessage() {$("#basefs-message-one").show()};
  function showOutputForm() {$("#basefs-form-two").show()};
  function showOutputMessage() {$("#basefs-message-two").show()};

  function getFieldValue(form, field) {
    return form.find("[name=" + field + "]").val();
  }

  function setFieldValue(form, field, value) {
    form.find("[name=" + field + "]").val(value).change();
  }

  function setImage(form, id, src) {
    form.find("#" + id)
        .css("background-image", "url(" + src + ")")
        .css("display", "block");
  }

  function clearForm(form, resetButtonText) {
    form.find("input").prop("disabled", false).val("").change();
    form.find(".form__image").css("display", "none");

    if (resetButtonText) {
      form.find(".form__button").prop("disabled", false).text(resetButtonText);
    }
  }

  function freezeForm(form) {
    form.find("input").prop("disabled", true);
    form.find(".form__button").prop("disabled", true).text("One Moment Please...");
  }

  function resetInputForm() {
    var form = $("#basefs-form-one");
    clearForm(form, "Try Again?");
  }

  function showErrorMessage() {
    $("#basefs-form-one h3").text("💩 Oops! Email Not Found");
  }

  function personalizeOutputForm(email, res) {
    hideInputForm();
    hideInputMessage();
    showOutputForm();
    showOutputMessage();

    var form = $("#basefs-form-two");

    clearForm(form);
    setFieldValue(form, "email", email);

    var fname = res.person.name.givenName,
        lname = res.person.name.familyName,
        title = res.person.employment.title,
        photo = res.person.avatar,
        cname = res.company.name,
        cemps = res.company.metrics.employeesRange,
        cinds = res.company.category.industry,
        clogo = res.company.logo;

    // Kind of fucked up that Clearbit doesn't have Oprah indexed
    if (email == "oprah@oprah.com") {
      title = "CEO";
      cinds = "Media";
    }

    if (fname) setFieldValue(form, "fname", fname);
    if (lname) setFieldValue(form, "lname", lname);
    if (title) setFieldValue(form, "title", title);
    if (cname) setFieldValue(form, "cname", cname);
    if (cemps) setFieldValue(form, "cemps", cemps);
    if (cinds) setFieldValue(form, "cinds", cinds);

    if (photo) setImage(form, "photo", photo);
    if (clogo) setImage(form, "clogo", clogo);
  }

  function enrichEmail(email) {
    var res = {};
    $.ajax({
      url: ENDP + "?email=" + email,
      timeout: WAIT,
      type: "GET"
    }).done(function(data) {
      res = JSON.parse(data);
      personalizeOutputForm(email, res);
    }).fail(function(jqXHR, textStatus) {
      resetInputForm();
      showErrorMessage();
    });
  }

  function initInputForm() {
    var form = $("#basefs-form-one");
    form.on("submit", function(event) {
      event.preventDefault();

      freezeForm(form);
      enrichEmail(getFieldValue(form, "email"));
    });
  }

  function initSuggested() {
    var suggested = $("[data-suggested]");
    var form = $("#basefs-form-one");

    suggested.on("click", function(event) {
      event.preventDefault();

      setFieldValue(form, "email", $(event.target).text());
    });
  }

  initInputForm();
  initSuggested();

});