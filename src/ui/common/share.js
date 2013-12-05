cdb.ui.common.ShareDialog = cdb.ui.common.Dialog.extend({

  tagName: 'div',
  className: 'cartodb-share-dialog',

  events: {
    'click .ok': '_ok',
    'click .cancel': '_cancel',
    'click .close': '_cancel',
    "click":                      '_stopPropagation',
    "dblclick":                   '_stopPropagation',
    "mousedown":                  '_stopPropagation'
  },

  default_options: {
    title: 'title',
    description: '',
    ok_title: 'Ok',
    cancel_title: 'Cancel',
    width: 300,
    height: 200,
    clean_on_hide: false,
    enter_to_confirm: false,
    template_name: 'common/views/dialog_base',
    ok_button_classes: 'button green',
    cancel_button_classes: '',
    modal_type: '',
    modal_class: '',
    include_footer: true,
    additionalButtons: []
  },

  initialize: function() {

    _.defaults(this.options, this.default_options);

    _.bindAll(this, 'render', '_keydown');

    var self = this;

    if (this.options.target) {
      this.options.target.on("click", function() {
        self.open();
      })
    }

    // Keydown bindings for the dialog
    $(document).bind('keydown', this._keydown);

    // After removing the dialog, cleaning other bindings
    this.bind("clean", this._reClean);

  },

  _stopPropagation: function(ev) {
    ev.stopPropagation();
  },

  render: function() {
    var $el = this.$el;

    $el.html(this.options.template(this.options));

    $el.find(".modal").css({
      width: this.options.width
    });

    if(this.render_content) {

      this.$('.content').append(this.render_content());
    }

    if(this.options.modal_class) {
      this.$el.addClass(this.options.modal_class);
    }

    var self = this;
    this.cancel = function(){
      self.options.model.set("scrollwheel", true);

    }

    this.options.model.set("scrollwheel", false);
    return this;
  }

});