exports.handler = async (event) => {
  //some importants logs for cloud watch
  const slots = event.sessionState.intent.slots;
  const intent = event.sessionState.intent.name;

  // For getting booking information intent
  if (intent === "GetBookingInfo") {
    if (!slots.BookingRef) {
      //Eliciting slot for user to enter booking reference
      return {
        sessionState: {
          dialogAction: {
            slotToElicit: "BookingRef",
            type: "ElicitSlot",
          },
          intent: {
            name: intent,
            slots: slots,
            state: "InProgress",
          },
        },
      };
    }
    //API call for fetch booking information if user enters the booking reference
    else {
      const bookingRef = event.inputTranscript;
      console.log("bookingRef", bookingRef);
      const apiUrl = `https://14ul0d9spk.execute-api.us-east-1.amazonaws.com/dev/bookingInfo/${bookingRef}`;
      try {
        const response = await fetch(apiUrl);
        const responseBody = await response.json();
        console.log("response booking info", responseBody);

        //if reference code is invalid
        if (responseBody.message === "Booking reference code not found") {
          const message =
            "Booking reference code not found, please enter valid booking reference code!";
          return {
            sessionState: {
              dialogAction: {
                slotToElicit: "BookingRef",
                type: "ElicitSlot",
                // fulfillmentState: "Fulfilled",
                // message: {
                //   contentType: "PlainText",
                //   content: message,
                // },
              },
              intent: {
                name: intent,
                state: "Fulfilled",
                slots: slots,
              },
            },
            messages: [
              {
                contentType: "PlainText",
                content: message,
              },
            ],
          };
        }
        if (responseBody.message === "Room information not found") {
          const message = "Room information not found!";
          return {
            sessionState: {
              dialogAction: {
                type: "Close",
                // fulfillmentState: "Fulfilled",
                // message: {
                //   contentType: "PlainText",
                //   content: message,
                // },
              },
              intent: {
                name: intent,
                state: "Fulfilled",
                slots: slots,
              },
            },
            messages: [
              {
                contentType: "PlainText",
                content: message,
              },
            ],
          };
        }
        const message = `Here are the booking details:\n
        Room Number: ${responseBody.room_number}\n
        Username: ${responseBody.username}\n
        Start Date: ${responseBody.start_date}\n
        End Date: ${responseBody.end_date}\n
        Features: ${responseBody.features}`;

        return {
          sessionState: {
            dialogAction: {
              type: "Close",
              // fulfillmentState: "Fulfilled",
              // message: {
              //   contentType: "PlainText",
              //   content: message,
              // },
            },
            intent: {
              name: intent,
              state: "Fulfilled",
              slots: slots,
            },
          },
          messages: [
            {
              contentType: "PlainText",
              content: message,
            },
          ],
        };
      } catch (error) {
        console.error("Error fetching booking information:", error);

        // Return a failure message to Lex
        return {
          sessionState: {
            dialogAction: {
              type: "Close",
              fulfillmentState: "Failed",
            },
            intent: {
              name: intent,
              state: "Failed",
              slots: slots,
            },
          },
          messages: [
            {
              contentType: "PlainText",
              content:
                "Sorry, there was an error retrieving booking information. Please try again later.",
            },
          ],
        };
      }
    }
    //For room availability checking intent
  } else if (intent === "RoomAvailabilityStatus") {
    //Eliciting slot to ask start date
    if (!slots.StartDate) {
      return {
        sessionState: {
          dialogAction: {
            slotToElicit: "StartDate",
            type: "ElicitSlot",
          },
          intent: {
            name: intent,
            slots: slots,
            state: "InProgress",
          },
        },
      };
    }
    //Eliciting slot to ask end date
    if (!slots.EndDate) {
      return {
        sessionState: {
          dialogAction: {
            slotToElicit: "EndDate",
            type: "ElicitSlot",
          },
          intent: {
            name: intent,
            slots: slots,
            state: "InProgress",
          },
        },
      };
    }
    if (!slots.RoomType) {
      return {
        sessionState: {
          dialogAction: {
            slotToElicit: "RoomType",
            type: "ElicitSlot",
          },
          intent: {
            name: intent,
            slots: slots,
            state: "InProgress",
          },
        },
      };
    }
    //API call for fetching available rooms for given duration by user
    if (slots.StartDate && slots.EndDate) {
      const startDate = slots.StartDate.value.originalValue;
      const endDate = slots.EndDate.value.originalValue;
      const roomType = slots.RoomType.value.originalValue;
      const apiUrl = `https://14ul0d9spk.execute-api.us-east-1.amazonaws.com/dev/getAvailableRooms/query?start_date=${startDate}&end_date=${endDate}&room_type=${roomType}`;

      try {
        const response = await fetch(apiUrl);
        const responseBody = await response.json();
        // Parse JSON response
        // const availableRooms = responseBody.length();
        console.log("availableRooms", responseBody);
        const message = "";
        if (responseBody.message === "Failed to fetch rooms") {
          message = "Sorry! No rooms available between given date range";
        }
        if (responseBody.length > 0) {
          message = `Hi, we have ${responseBody.length} rooms availble between the dates you provided, for more information about the room please visit: https://csci5410-project-frontend-azb3ssr6zq-uk.a.run.app/check-availability`;
        }

        return {
          sessionState: {
            dialogAction: {
              type: "Close",
              // fulfillmentState: "Fulfilled",
              // message: {
              //   contentType: "PlainText",
              //   content: message,
              // },
            },
            intent: {
              name: intent,
              state: "Fulfilled",
              slots: slots,
            },
          },
          messages: [
            {
              contentType: "PlainText",
              content: message,
            },
          ],
        };
      } catch (error) {
        console.log("Error fetching booking information:", error);

        // Return a failure message to Lex
        return {
          sessionState: {
            dialogAction: {
              type: "Close",
              fulfillmentState: "Failed",
            },
            intent: {
              name: intent,
              state: "Failed",
              slots: slots,
            },
          },
          messages: [
            {
              contentType: "PlainText",
              content:
                "Sorry, there was an error retrieving booking information. Please try again later.",
            },
          ],
        };
      }
    }
  } else if (intent === "ConnecToPropertyAgent") {
    //Eliciting slot to ask start date
    if (!slots.ReferenceCode) {
      return {
        sessionState: {
          dialogAction: {
            slotToElicit: "ReferenceCode",
            type: "ElicitSlot",
          },
          intent: {
            name: intent,
            slots: slots,
            state: "InProgress",
          },
        },
      };
    }
    //Eliciting slot to ask end date
    if (!slots.ConcernMessage) {
      return {
        sessionState: {
          dialogAction: {
            slotToElicit: "ConcernMessage",
            type: "ElicitSlot",
          },
          intent: {
            name: intent,
            slots: slots,
            state: "InProgress",
          },
        },
      };
    }
    //API call for fetching available rooms for given duration by user
    if (slots.ReferenceCode && slots.ConcernMessage) {
      const referenceCode = slots.ReferenceCode.value.originalValue;
      const concernMessage = slots.ConcernMessage.value.originalValue;
      console.log(
        "referenceCode ConcernMessage",
        referenceCode,
        concernMessage
      );
      const apiUrl = `https://us-central1-csci-5410-428021.cloudfunctions.net/publish_message_to_agent`;

      const payload = {
        message: concernMessage,
        booking_ref_code: referenceCode,
      };

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const responseBody = await response.json();
        // Parse JSON response
        // const availableRooms = responseBody.length();
        const message =
          "Thank you, we have raised a ticket agent will contact you soon!";
        return {
          sessionState: {
            dialogAction: {
              type: "Close",
              // fulfillmentState: "Fulfilled",
              // message: {
              //   contentType: "PlainText",
              //   content: message,
              // },
            },
            intent: {
              name: intent,
              state: "Fulfilled",
              slots: slots,
            },
          },
          messages: [
            {
              contentType: "PlainText",
              content: message,
            },
          ],
        };
      } catch (error) {
        console.log("Error initiating message:", error);

        // Return a failure message to Lex
        return {
          sessionState: {
            dialogAction: {
              type: "Close",
            },
            intent: {
              name: intent,
              state: "Failed",
              slots: slots,
            },
          },
          messages: [
            {
              contentType: "PlainText",
              content: "Sorry, something went wrong please try again once!",
            },
          ],
        };
      }
    }
  }
};
