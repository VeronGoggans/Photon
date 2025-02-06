class EventBus:
    """
    A simple EventBus that allows subscription to events and emission of events to subscribers.

    The EventBus stores listeners for different event names, and allows functions (callbacks) to subscribe to specific events. 
    When an event is emitted, all the subscribed listeners are called with the event data.
    """

    def __init__(self):
        """
        Initializes the EventBus with an empty set of listeners.

        Listeners will be stored in a dictionary where the key is the event name, 
        and the value is a list of callback functions subscribed to that event.
        """
        self.listeners = {}


    def subscribe(self, event_name, callback):
        """
        Subscribes a callback function to an event.

        Args:
            event_name (str): The name of the event to subscribe to.
            callback (function): The function to call when the event is emitted.

        If the event already has listeners, the callback is appended to the existing list.
        Otherwise, a new list of listeners is created for that event.
        """
        if event_name not in self.listeners:
            self.listeners[event_name] = []
        self.listeners[event_name].append(callback)


    def emit(self, event_name, **kwargs):
        """
        Emits an event and calls all the subscribed listeners with the event data.

        Args:
            event_name (str): The name of the event to emit.
            **kwargs: Arbitrary keyword arguments that will be passed to each listener function.

        If the event has listeners, each listener is called with the provided keyword arguments. 
        If no listeners are subscribed to the event, nothing happens.
        """
        if event_name in self.listeners:
            for callback in self.listeners[event_name]:
                callback(**kwargs)  # Pass keyword arguments directly to the handler

# Global EventBus
event_bus: EventBus = EventBus()

# Events for the EventBus
convert_notes_event = "convert_notes"