define(function(require) {
	var $ = require('jquery'),
		_ = require('underscore'),
		monster = require('monster');

	var servicePlanDetails = {

		requests: {},

		subscribe: {
			'common.numberFeaturesMenu.render': 'numberFeaturesMenuRender'
		},

		numberFeaturesMenuRender: function(args) {
			var self = this,
				numberData = args.numberData,
				phoneNumber = numberData.hasOwnProperty('phoneNumber') ? numberData.phoneNumber : numberData.id,
				features = self.numberFeaturesMenuGetFeatures(numberData),
				template = $(monster.template(self, 'numberFeaturesMenu-dropdown', { features: features }));

			self.numberFeaturesMenuBindEvents(template, phoneNumber, args.afterUpdate);

			args.target.append(template);
		},

		numberFeaturesMenuGetFeatures: function(number) {
			var self = this,
				featuresNumber;

			if (number.hasOwnProperty('features_available') && number.features_available.length) {
				featuresNumber = number.features_available;
			} else if (number.hasOwnProperty('_read_only') && number._read_only.hasOwnProperty('features_available') && number._read_only.features_available.length) {
				featuresNumber = number._read_only.features_available;
			} else {
				featuresNumber = [];
			}

			return featuresNumber;
		},

		numberFeaturesMenuBindEvents: function(template, phoneNumber, afterUpdate) {
			var self = this,
				args = {
					phoneNumber: phoneNumber,
					callbacks: {
						success: function(data) {
							afterUpdate && afterUpdate(data.data.features, template);
						}
					}
				};

			template.find('.failover-number').on('click', function() {
				// We add this at the moment of the event because in some cases, we bind the events before it's adding to a parent,
				// which means the account-section might not be loaded yet if we bound it before the event happened.
				if ($(this).parents('.account-section').length) {
					args.accountId = template.parents('.account-section').data('id');
				}

				monster.pub('common.failover.renderPopup', args);
			});

			template.find('.cnam-number').on('click', function() {
				if ($(this).parents('.account-section').length) {
					args.accountId = template.parents('.account-section').data('id');
				}

				monster.pub('common.callerId.renderPopup', args);
			});

			template.find('.e911-number').on('click', function() {
				if ($(this).parents('.account-section').length) {
					args.accountId = template.parents('.account-section').data('id');
				}

				monster.pub('common.e911.renderPopup', args);
			});

			template.find('.prepend-number').on('click', function() {
				if ($(this).parents('.account-section').length) {
					args.accountId = template.parents('.account-section').data('id');
				}

				monster.pub('common.numberPrepend.renderPopup', args);
			});

			template.find('.rename-carrier-number').on('click', function() {
				if ($(this).parents('.account-section').length) {
					args.accountId = template.parents('.account-section').data('id');
				}

				monster.pub('common.numberRenameCarrier.renderPopup', args);
			});
		}
	};

	return servicePlanDetails;
});
