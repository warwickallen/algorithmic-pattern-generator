// UI Component Library (R3 Implementation)
class SharedComponents {
  // Common slider component with performance optimization
  static createSlider(config) {
    const { id, min, max, step, value, label, format } = config;
    return {
      element: document.getElementById(id),
      valueElement: document.getElementById(`${id}-value`),
      label,
      format: format || ((val) => val.toString()),
      range: { min, max, step, default: value },
    };
  }

  // Common button component
  static createButton(id, label, className = "btn secondary") {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = label;
      element.className = className;
    }
    return element;
  }

  // Common control group wrapper
  static createControlGroup(controls) {
    return controls
      .map((control) => {
        if (control.type === "slider") {
          return this.createSlider(control);
        } else if (control.type === "button") {
          return this.createButton(
            control.id,
            control.label,
            control.className
          );
        }
        return null;
      })
      .filter(Boolean);
  }
}

// Enhanced UI Component Library with comprehensive lifecycle management
class UIComponentLibrary {
  constructor(eventFramework) {
    this.components = new Map();
    this.lifecycleHooks = new Map();
    this.componentTypes = new Set();
    this.defaultConfigs = new Map();
    this.eventFramework = eventFramework;
    this.initDefaultConfigs();
  }

  // Initialize default configurations for all component types
  initDefaultConfigs() {
    const speedDefaults =
      typeof AppConstants !== "undefined"
        ? AppConstants.UISliders.SPEED
        : { min: 0, max: 100, step: 1, value: 50 };
    this.defaultConfigs.set("slider", {
      min: speedDefaults.min,
      max: speedDefaults.max,
      step: speedDefaults.step,
      value: speedDefaults.value,
      format: (val) => val.toString(),
      className: "slider",
    });

    this.defaultConfigs.set("button", {
      className: "btn secondary",
      disabled: false,
      pressed: false,
    });

    this.defaultConfigs.set("select", {
      className: "simulation-select",
      placeholder: "Select option...",
    });

    this.defaultConfigs.set("controlGroup", {
      className: "control-group control-panel",
      layout: "horizontal", // horizontal, vertical, grid
      gap: "0.5rem",
      visible: true,
    });

    this.defaultConfigs.set("statusDisplay", {
      className: "status-info",
      layout: "horizontal",
      gap: "0.5rem",
      format: (value) => value.toString(),
    });

    this.defaultConfigs.set("modal", {
      className: "modal",
      backdrop: true,
      closeOnEscape: true,
      closeOnBackdrop: true,
      animation: true,
    });

    this.defaultConfigs.set("label", {
      className: "control-label",
      required: false,
    });

    this.defaultConfigs.set("container", {
      className: "ui-container",
      layout: "horizontal",
      gap: "0.5rem",
      visible: true,
    });
  }

  // Create a standardized slider component with enhanced features
  createSlider(config) {
    const defaultConfig = this.defaultConfigs.get("slider");
    const mergedConfig = { ...defaultConfig, ...config };

    const component = {
      type: "slider",
      id: mergedConfig.id,
      element: document.getElementById(mergedConfig.id),
      valueElement: document.getElementById(mergedConfig.valueElementId),
      config: mergedConfig,
      state: {
        value: mergedConfig.value || mergedConfig.min,
        isEnabled: !mergedConfig.disabled,
        isVisible: true,
        isDragging: false,
      },
      methods: {
        setValue: (value) => this.setSliderValue(component, value),
        getValue: () => this.getSliderValue(component),
        enable: () => this.enableComponent(component),
        disable: () => this.disableComponent(component),
        show: () => this.showComponent(component),
        hide: () => this.hideComponent(component),
        update: (newConfig) => this.updateSlider(component, newConfig),
        addEventListener: (event, handler) =>
          this.addComponentEventListener(component, event, handler),
        removeEventListener: (event) =>
          this.removeComponentEventListener(component, event),
      },
    };

    this.components.set(mergedConfig.id, component);
    this.componentTypes.add("slider");
    this.initializeComponent(component);
    return component;
  }

  // Create a standardized button component with enhanced features
  createButton(config) {
    const defaultConfig = this.defaultConfigs.get("button");
    const mergedConfig = { ...defaultConfig, ...config };

    const component = {
      type: "button",
      id: mergedConfig.id,
      element: document.getElementById(mergedConfig.id),
      config: mergedConfig,
      state: {
        isEnabled: !mergedConfig.disabled,
        isPressed: mergedConfig.pressed || false,
        isVisible: true,
        text: mergedConfig.label || mergedConfig.text || "",
      },
      methods: {
        setText: (text) => this.setButtonText(component, text),
        getText: () => this.getButtonText(component),
        enable: () => this.enableComponent(component),
        disable: () => this.disableComponent(component),
        show: () => this.showComponent(component),
        hide: () => this.hideComponent(component),
        press: () => this.pressButton(component),
        release: () => this.releaseButton(component),
        toggle: () => this.toggleButton(component),
        update: (newConfig) => this.updateButton(component, newConfig),
        addEventListener: (event, handler) =>
          this.addComponentEventListener(component, event, handler),
        removeEventListener: (event) =>
          this.removeComponentEventListener(component, event),
      },
    };

    this.components.set(mergedConfig.id, component);
    this.componentTypes.add("button");
    this.initializeComponent(component);
    return component;
  }

  // Create a select dropdown component
  createSelect(config) {
    const defaultConfig = this.defaultConfigs.get("select");
    const mergedConfig = { ...defaultConfig, ...config };

    const component = {
      type: "select",
      id: mergedConfig.id,
      element: document.getElementById(mergedConfig.id),
      config: mergedConfig,
      state: {
        value: mergedConfig.value || "",
        isEnabled: !mergedConfig.disabled,
        isVisible: true,
        options: mergedConfig.options || [],
      },
      methods: {
        setValue: (value) => this.setSelectValue(component, value),
        getValue: () => this.getSelectValue(component),
        setOptions: (options) => this.setSelectOptions(component, options),
        getOptions: () => this.getSelectOptions(component),
        enable: () => this.enableComponent(component),
        disable: () => this.disableComponent(component),
        show: () => this.showComponent(component),
        hide: () => this.hideComponent(component),
        update: (newConfig) => this.updateSelect(component, newConfig),
        addEventListener: (event, handler) =>
          this.addComponentEventListener(component, event, handler),
        removeEventListener: (event) =>
          this.removeComponentEventListener(component, event),
      },
    };

    this.components.set(mergedConfig.id, component);
    this.componentTypes.add("select");
    this.initializeComponent(component);
    return component;
  }

  // Create a control group component with enhanced layout options
  createControlGroup(groupId, controls = []) {
    const defaultConfig = this.defaultConfigs.get("controlGroup");
    const mergedConfig = { ...defaultConfig, ...controls };

    const component = {
      type: "controlGroup",
      id: groupId,
      element: document.getElementById(groupId),
      controls: controls,
      config: mergedConfig,
      state: {
        isVisible: mergedConfig.visible,
        isEnabled: true,
        layout: mergedConfig.layout,
        gap: mergedConfig.gap,
      },
      methods: {
        show: () => this.showControlGroup(component),
        hide: () => this.hideControlGroup(component),
        enable: () => this.enableComponent(component),
        disable: () => this.disableComponent(component),
        setLayout: (layout) => this.setControlGroupLayout(component, layout),
        addControl: (control) => this.addControlToGroup(component, control),
        removeControl: (controlId) =>
          this.removeControlFromGroup(component, controlId),
        updateControls: (newControls) =>
          this.updateControlGroup(component, newControls),
        getControls: () => this.getControlGroupControls(component),
        update: (newConfig) => this.updateControlGroup(component, newConfig),
      },
    };

    this.components.set(groupId, component);
    this.componentTypes.add("controlGroup");
    this.initializeComponent(component);
    return component;
  }

  // Create a status display component
  createStatusDisplay(config) {
    const defaultConfig = this.defaultConfigs.get("statusDisplay");
    const mergedConfig = { ...defaultConfig, ...config };

    const component = {
      type: "statusDisplay",
      id: mergedConfig.id,
      element: document.getElementById(mergedConfig.id),
      config: mergedConfig,
      state: {
        values: mergedConfig.values || {},
        isVisible: true,
        layout: mergedConfig.layout,
        gap: mergedConfig.gap,
      },
      methods: {
        setValue: (key, value) => this.setStatusValue(component, key, value),
        getValue: (key) => this.getStatusValue(component, key),
        setValues: (values) => this.setStatusValues(component, values),
        getValues: () => this.getStatusValues(component),
        show: () => this.showComponent(component),
        hide: () => this.hideComponent(component),
        setLayout: (layout) => this.setStatusLayout(component, layout),
        update: (newConfig) => this.updateStatusDisplay(component, newConfig),
        addEventListener: (event, handler) =>
          this.addComponentEventListener(component, event, handler),
        removeEventListener: (event) =>
          this.removeComponentEventListener(component, event),
      },
    };

    this.components.set(mergedConfig.id, component);
    this.componentTypes.add("statusDisplay");
    this.initializeComponent(component);
    return component;
  }

  // Create a modal component
  createModal(config) {
    const defaultConfig = this.defaultConfigs.get("modal");
    const mergedConfig = { ...defaultConfig, ...config };

    const component = {
      type: "modal",
      id: mergedConfig.id,
      element: document.getElementById(mergedConfig.id),
      config: mergedConfig,
      state: {
        isVisible: false,
        isOpen: false,
        title: mergedConfig.title || "",
        content: mergedConfig.content || "",
        backdrop: mergedConfig.backdrop,
        closeOnEscape: mergedConfig.closeOnEscape,
        closeOnBackdrop: mergedConfig.closeOnBackdrop,
        animation: mergedConfig.animation,
      },
      methods: {
        open: () => this.openModal(component),
        close: () => this.closeModal(component),
        toggle: () => this.toggleModal(component),
        setContent: (content) => this.setModalContent(component, content),
        getContent: () => this.getModalContent(component),
        setTitle: (title) => this.setModalTitle(component, title),
        getTitle: () => this.getModalTitle(component),
        update: (newConfig) => this.updateModal(component, newConfig),
        addEventListener: (event, handler) =>
          this.addComponentEventListener(component, event, handler),
        removeEventListener: (event) =>
          this.removeComponentEventListener(component, event),
      },
    };

    this.components.set(mergedConfig.id, component);
    this.componentTypes.add("modal");
    this.initializeComponent(component);
    return component;
  }

  // Create a label component
  createLabel(config) {
    const defaultConfig = this.defaultConfigs.get("label");
    const mergedConfig = { ...defaultConfig, ...config };

    const component = {
      type: "label",
      id: mergedConfig.id,
      element: document.getElementById(mergedConfig.id),
      config: mergedConfig,
      state: {
        text: mergedConfig.text || mergedConfig.label || "",
        isVisible: true,
        required: mergedConfig.required,
      },
      methods: {
        setText: (text) => this.setLabelText(component, text),
        getText: () => this.getLabelText(component),
        show: () => this.showComponent(component),
        hide: () => this.hideComponent(component),
        setRequired: (required) => this.setLabelRequired(component, required),
        update: (newConfig) => this.updateLabel(component, newConfig),
      },
    };

    this.components.set(mergedConfig.id, component);
    this.componentTypes.add("label");
    this.initializeComponent(component);
    return component;
  }

  // Create a container component for layout management
  createContainer(config) {
    const defaultConfig = this.defaultConfigs.get("container");
    const mergedConfig = { ...defaultConfig, ...config };

    const component = {
      type: "container",
      id: mergedConfig.id,
      element: document.getElementById(mergedConfig.id),
      config: mergedConfig,
      state: {
        isVisible: mergedConfig.visible,
        layout: mergedConfig.layout,
        gap: mergedConfig.gap,
        children: mergedConfig.children || [],
      },
      methods: {
        show: () => this.showComponent(component),
        hide: () => this.hideComponent(component),
        setLayout: (layout) => this.setContainerLayout(component, layout),
        addChild: (childId) => this.addContainerChild(component, childId),
        removeChild: (childId) => this.removeChildFromGroup(component, childId),
        getChildren: () => this.getContainerChildren(component),
        update: (newConfig) => this.updateContainer(component, newConfig),
      },
    };

    this.components.set(mergedConfig.id, component);
    this.componentTypes.add("container");
    this.initializeComponent(component);
    return component;
  }

  // Component lifecycle management
  initializeComponent(component) {
    switch (component.type) {
      case "slider":
        this.initializeSlider(component);
        break;
      case "button":
        this.initializeButton(component);
        break;
      case "select":
        this.initializeSelect(component);
        break;
      case "controlGroup":
        this.initializeControlGroup(component);
        break;
      case "statusDisplay":
        this.initializeStatusDisplay(component);
        break;
      case "modal":
        this.initializeModal(component);
        break;
      case "label":
        this.initializeLabel(component);
        break;
      case "container":
        this.initializeContainer(component);
        break;
    }

    // Register lifecycle hooks
    this.registerLifecycleHooks(component);

    // Trigger onMount hook
    const hooks = this.lifecycleHooks.get(component.id);
    if (hooks && hooks.onMount) {
      hooks.onMount();
    }
  }

  // Initialize specific component types
  initializeSlider(component) {
    if (component.element) {
      component.element.min = component.config.min;
      component.element.max = component.config.max;
      component.element.step = component.config.step;
      component.element.value = component.state.value;
      component.element.className = component.config.className;

      if (component.valueElement) {
        component.valueElement.textContent = component.config.format(
          component.state.value
        );
      }
    }
  }

  initializeButton(component) {
    if (component.element) {
      component.element.textContent = component.state.text;
      component.element.className = component.config.className;
      component.element.disabled = !component.state.isEnabled;

      if (component.state.isPressed) {
        component.element.classList.add("pressed");
      }
    }
  }

  initializeSelect(component) {
    if (component.element) {
      component.element.className = component.config.className;
      component.element.disabled = !component.state.isEnabled;

      if (component.state.options.length > 0) {
        this.setSelectOptions(component, component.state.options);
      }

      if (component.state.value) {
        component.element.value = component.state.value;
      }
    }
  }

  initializeControlGroup(component) {
    if (component.element) {
      component.element.style.display = component.state.isVisible
        ? "flex"
        : "none";
      component.element.className = component.config.className;

      // Apply layout styles
      if (component.state.layout === "vertical") {
        component.element.style.flexDirection = "column";
      } else if (component.state.layout === "grid") {
        component.element.style.display = "grid";
      }

      component.element.style.gap = component.state.gap;
    }
  }

  initializeStatusDisplay(component) {
    if (component.element) {
      component.element.style.display = component.state.isVisible
        ? "flex"
        : "none";
      component.element.className = component.config.className;

      if (component.state.layout === "vertical") {
        component.element.style.flexDirection = "column";
      }

      component.element.style.gap = component.state.gap;
    }
  }

  initializeModal(component) {
    if (component.element) {
      component.element.className = component.config.className;
      component.element.style.display = "none";
    }
  }

  initializeLabel(component) {
    if (component.element) {
      component.element.textContent = component.state.text;
      component.element.className = component.config.className;
      component.element.style.display = component.state.isVisible
        ? "block"
        : "none";

      if (component.state.required) {
        component.element.classList.add("required");
      }
    }
  }

  initializeContainer(component) {
    if (component.element) {
      component.element.style.display = component.state.isVisible
        ? "flex"
        : "none";
      component.element.className = component.config.className;

      if (component.state.layout === "vertical") {
        component.element.style.flexDirection = "column";
      } else if (component.state.layout === "grid") {
        component.element.style.display = "grid";
      }

      component.element.style.gap = component.state.gap;
    }
  }

  // Component state management methods
  setSliderValue(component, value) {
    if (component.element) {
      component.state.value = value;
      component.element.value = value;

      if (component.valueElement) {
        component.valueElement.textContent = component.config.format(value);
      }

      this.triggerUpdateHook(component);
    }
  }

  getSliderValue(component) {
    return component.state.value;
  }

  setButtonText(component, text) {
    if (component.element) {
      component.state.text = text;
      component.element.textContent = text;
      this.triggerUpdateHook(component);
    }
  }

  getButtonText(component) {
    return component.state.text;
  }

  setSelectValue(component, value) {
    if (component.element) {
      component.state.value = value;
      component.element.value = value;
      this.triggerUpdateHook(component);
    }
  }

  getSelectValue(component) {
    return component.state.value;
  }

  setSelectOptions(component, options) {
    if (component.element) {
      component.state.options = options;
      component.element.innerHTML = "";

      options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.label || option.text;
        component.element.appendChild(optionElement);
      });

      this.triggerUpdateHook(component);
    }
  }

  getSelectOptions(component) {
    return component.state.options;
  }

  setStatusValue(component, key, value) {
    component.state.values[key] = value;

    if (component.element) {
      const valueElement = component.element.querySelector(
        `[data-key="${key}"]`
      );
      if (valueElement) {
        valueElement.textContent = component.config.format(value);
      }
    }

    this.triggerUpdateHook(component);
  }

  getStatusValue(component, key) {
    return component.state.values[key];
  }

  setStatusValues(component, values) {
    component.state.values = { ...values };

    if (component.element) {
      Object.entries(values).forEach(([key, value]) => {
        const valueElement = component.element.querySelector(
          `[data-key="${key}"]`
        );
        if (valueElement) {
          valueElement.textContent = component.config.format(value);
        }
      });
    }

    this.triggerUpdateHook(component);
  }

  getStatusValues(component) {
    return { ...component.state.values };
  }

  setLabelText(component, text) {
    if (component.element) {
      component.state.text = text;
      component.element.textContent = text;
      this.triggerUpdateHook(component);
    }
  }

  getLabelText(component) {
    return component.state.text;
  }

  // Component visibility and state management
  enableComponent(component) {
    component.state.isEnabled = true;
    if (component.element) {
      component.element.disabled = false;
    }
    this.triggerUpdateHook(component);
  }

  disableComponent(component) {
    component.state.isEnabled = false;
    if (component.element) {
      component.element.disabled = true;
    }
    this.triggerUpdateHook(component);
  }

  showComponent(component) {
    component.state.isVisible = true;
    if (component.element) {
      component.element.style.display =
        component.type === "label" ? "block" : "flex";
    }
    this.triggerUpdateHook(component);
  }

  hideComponent(component) {
    component.state.isVisible = false;
    if (component.element) {
      component.element.style.display = "none";
    }
    this.triggerUpdateHook(component);
  }

  showControlGroup(component) {
    this.showComponent(component);
  }

  hideControlGroup(component) {
    this.hideComponent(component);
  }

  pressButton(component) {
    component.state.isPressed = true;
    if (component.element) {
      component.element.classList.add("pressed");
    }
    this.triggerUpdateHook(component);
  }

  releaseButton(component) {
    component.state.isPressed = false;
    if (component.element) {
      component.element.classList.remove("pressed");
    }
    this.triggerUpdateHook(component);
  }

  toggleButton(component) {
    if (component.state.isPressed) {
      this.releaseButton(component);
    } else {
      this.pressButton(component);
    }
  }

  // Modal-specific methods
  openModal(component) {
    if (component.element) {
      component.state.isVisible = true;
      component.state.isOpen = true;
      component.element.style.display = "block";

      if (component.state.backdrop) {
        this.createModalBackdrop(component);
      }

      if (component.state.closeOnEscape) {
        this.setupModalEscapeHandler(component);
      }

      this.triggerUpdateHook(component);
    }
  }

  closeModal(component) {
    if (component.element) {
      component.state.isVisible = false;
      component.state.isOpen = false;
      component.element.style.display = "none";

      this.removeModalBackdrop(component);
      this.removeModalEscapeHandler(component);

      this.triggerUpdateHook(component);
    }
  }

  toggleModal(component) {
    if (component.state.isOpen) {
      this.closeModal(component);
    } else {
      this.openModal(component);
    }
  }

  setModalContent(component, content) {
    if (component.element) {
      const contentElement = component.element.querySelector(
        "[data-modal-content]"
      );
      if (contentElement) {
        contentElement.innerHTML = content;
      }
    }
  }

  getModalContent(component) {
    if (component.element) {
      const contentElement = component.element.querySelector(
        "[data-modal-content]"
      );
      return contentElement ? contentElement.innerHTML : "";
    }
    return "";
  }

  setModalTitle(component, title) {
    if (component.element) {
      const titleElement =
        component.element.querySelector("[data-modal-title]");
      if (titleElement) {
        titleElement.textContent = title;
      }
    }
  }

  getModalTitle(component) {
    if (component.element) {
      const titleElement =
        component.element.querySelector("[data-modal-title]");
      return titleElement ? titleElement.textContent : "";
    }
    return "";
  }

  // Control group specific methods
  setControlGroupLayout(component, layout) {
    component.state.layout = layout;
    if (component.element) {
      if (layout === "vertical") {
        component.element.style.flexDirection = "column";
      } else if (layout === "grid") {
        component.element.style.display = "grid";
      } else {
        component.element.style.display = "flex";
        component.element.style.flexDirection = "row";
      }
    }
    this.triggerUpdateHook(component);
  }

  addControlToGroup(component, control) {
    component.state.children.push(control);
    this.triggerUpdateHook(component);
  }

  removeControlFromGroup(component, controlId) {
    component.state.children = component.state.children.filter(
      (child) => child.id !== controlId
    );
    this.triggerUpdateHook(component);
  }

  getControlGroupControls(component) {
    return [...component.state.children];
  }

  // Status display specific methods
  setStatusLayout(component, layout) {
    component.state.layout = layout;
    if (component.element) {
      if (layout === "vertical") {
        component.element.style.flexDirection = "column";
      } else {
        component.element.style.flexDirection = "row";
      }
    }
    this.triggerUpdateHook(component);
  }

  // Container specific methods
  setContainerLayout(component, layout) {
    component.state.layout = layout;
    if (component.element) {
      if (layout === "vertical") {
        component.element.style.flexDirection = "column";
      } else if (layout === "grid") {
        component.element.style.display = "grid";
      } else {
        component.element.style.display = "flex";
        component.element.style.flexDirection = "row";
      }
    }
    this.triggerUpdateHook(component);
  }

  addContainerChild(component, childId) {
    component.state.children.push(childId);
    this.triggerUpdateHook(component);
  }

  removeContainerChild(component, childId) {
    component.state.children = component.state.children.filter(
      (id) => id !== childId
    );
    this.triggerUpdateHook(component);
  }

  getContainerChildren(component) {
    return [...component.state.children];
  }

  // Label specific methods
  setLabelRequired(component, required) {
    component.state.required = required;
    if (component.element) {
      if (required) {
        component.element.classList.add("required");
      } else {
        component.element.classList.remove("required");
      }
    }
    this.triggerUpdateHook(component);
  }

  // Component update methods
  updateSlider(component, newConfig) {
    Object.assign(component.config, newConfig);
    this.initializeSlider(component);
    this.triggerUpdateHook(component);
  }

  updateButton(component, newConfig) {
    Object.assign(component.config, newConfig);
    this.initializeButton(component);
    this.triggerUpdateHook(component);
  }

  updateSelect(component, newConfig) {
    Object.assign(component.config, newConfig);
    this.initializeSelect(component);
    this.triggerUpdateHook(component);
  }

  updateControlGroup(component, newConfig) {
    Object.assign(component.config, newConfig);
    this.initializeControlGroup(component);
    this.triggerUpdateHook(component);
  }

  updateStatusDisplay(component, newConfig) {
    Object.assign(component.config, newConfig);
    this.initializeStatusDisplay(component);
    this.triggerUpdateHook(component);
  }

  updateModal(component, newConfig) {
    Object.assign(component.config, newConfig);
    this.initializeModal(component);
    this.triggerUpdateHook(component);
  }

  updateLabel(component, newConfig) {
    Object.assign(component.config, newConfig);
    this.initializeLabel(component);
    this.triggerUpdateHook(component);
  }

  updateContainer(component, newConfig) {
    Object.assign(component.config, newConfig);
    this.initializeContainer(component);
    this.triggerUpdateHook(component);
  }

  // Event handling methods
  addComponentEventListener(component, event, handler) {
    if (component.element && this.eventFramework) {
      this.eventFramework.register(component.element, event, handler);
    }
  }

  removeComponentEventListener(component, event) {
    if (component.element && this.eventFramework) {
      this.eventFramework.remove(component.element, event);
    }
  }

  // Lifecycle hook management
  registerLifecycleHooks(component) {
    const hooks = {
      onMount: () =>
        typeof Logger !== "undefined"
          ? Logger.debug(`Component ${component.id} mounted`)
          : void 0,
      onUnmount: () =>
        typeof Logger !== "undefined"
          ? Logger.debug(`Component ${component.id} unmounted`)
          : void 0,
      onUpdate: () =>
        typeof Logger !== "undefined"
          ? Logger.debug(`Component ${component.id} updated`)
          : void 0,
      onShow: () =>
        typeof Logger !== "undefined"
          ? Logger.debug(`Component ${component.id} shown`)
          : void 0,
      onHide: () =>
        typeof Logger !== "undefined"
          ? Logger.debug(`Component ${component.id} hidden`)
          : void 0,
      onEnable: () =>
        typeof Logger !== "undefined"
          ? Logger.debug(`Component ${component.id} enabled`)
          : void 0,
      onDisable: () =>
        typeof Logger !== "undefined"
          ? Logger.debug(`Component ${component.id} disabled`)
          : void 0,
    };

    this.lifecycleHooks.set(component.id, hooks);
  }

  triggerUpdateHook(component) {
    const hooks = this.lifecycleHooks.get(component.id);
    if (hooks && hooks.onUpdate) {
      hooks.onUpdate();
    }
  }

  // Modal helper methods
  createModalBackdrop(component) {
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
        `;

    if (component.state.closeOnBackdrop) {
      backdrop.addEventListener("click", () => this.closeModal(component));
    }

    document.body.appendChild(backdrop);
    component.backdropElement = backdrop;
  }

  removeModalBackdrop(component) {
    if (component.backdropElement) {
      component.backdropElement.remove();
      component.backdropElement = null;
    }
  }

  setupModalEscapeHandler(component) {
    const escapeHandler = (e) => {
      if (e.key === "Escape") {
        this.closeModal(component);
      }
    };

    document.addEventListener("keydown", escapeHandler);
    component.escapeHandler = escapeHandler;
  }

  removeModalEscapeHandler(component) {
    if (component.escapeHandler) {
      document.removeEventListener("keydown", component.escapeHandler);
      component.escapeHandler = null;
    }
  }

  // Utility methods
  getComponent(id) {
    return this.components.get(id);
  }

  getAllComponents() {
    return Array.from(this.components.values());
  }

  getComponentsByType(type) {
    return Array.from(this.components.values()).filter(
      (component) => component.type === type
    );
  }

  hasComponent(id) {
    return this.components.has(id);
  }

  getComponentTypes() {
    return this.componentTypes;
  }

  // Batch operations
  showAllComponents() {
    this.components.forEach((component) => {
      this.showComponent(component);
    });
  }

  hideAllComponents() {
    this.components.forEach((component) => {
      this.hideComponent(component);
    });
  }

  enableAllComponents() {
    this.components.forEach((component) => {
      this.enableComponent(component);
    });
  }

  disableAllComponents() {
    this.components.forEach((component) => {
      this.disableComponent(component);
    });
  }

  // Component cleanup
  cleanup() {
    // Trigger onUnmount hooks
    this.components.forEach((component) => {
      const hooks = this.lifecycleHooks.get(component.id);
      if (hooks && hooks.onUnmount) {
        hooks.onUnmount();
      }
    });

    this.components.clear();
    this.lifecycleHooks.clear();
    this.componentTypes.clear();
  }

  // Factory methods for common component combinations
  createSliderWithLabel(config) {
    const slider = this.createSlider(config);
    const label = this.createLabel({
      id: `${config.id}-label`,
      text: config.label,
      for: config.id,
    });

    return { slider, label };
  }

  createButtonGroup(buttons) {
    const groupId = `button-group-${Date.now()}`;
    const group = this.createControlGroup(groupId, {
      layout: "horizontal",
      className: "button-group",
    });

    buttons.forEach((buttonConfig) => {
      const button = this.createButton(buttonConfig);
      group.methods.addControl(button);
    });

    return group;
  }

  createFormGroup(controls) {
    const groupId = `form-group-${Date.now()}`;
    const group = this.createControlGroup(groupId, {
      layout: "vertical",
      className: "form-group",
    });

    controls.forEach((controlConfig) => {
      let control;
      switch (controlConfig.type) {
        case "slider":
          control = this.createSlider(controlConfig);
          break;
        case "button":
          control = this.createButton(controlConfig);
          break;
        case "select":
          control = this.createSelect(controlConfig);
          break;
        case "label":
          control = this.createLabel(controlConfig);
          break;
      }

      if (control) {
        group.methods.addControl(control);
      }
    });

    return group;
  }
}

// Dynamic Speed Slider - consolidates multiple speed sliders into a single dynamic component
class DynamicSpeedSlider {
  constructor(eventFramework) {
    this.eventFramework = eventFramework;
    this.currentSimType = null;
    this.slider = null;
    this.valueElement = null;
    this.container = null;
    this.speedValues = new Map(); // Store speed values for each simulation
    this.isInitialized = false;

    this.init();
  }

  init() {
    // Prefer the most recently added elements if duplicates exist in DOM during tests
    const sliders = document.querySelectorAll("#dynamic-speed-slider");
    this.slider = sliders.length ? sliders[sliders.length - 1] : null;
    const values = document.querySelectorAll("#dynamic-speed-value");
    this.valueElement = values.length ? values[values.length - 1] : null;
    const containers = document.querySelectorAll(
      ".speed-control .control-group"
    );
    this.container = containers.length
      ? containers[containers.length - 1]
      : null;

    if (!this.slider || !this.valueElement || !this.container) {
      if (typeof Logger !== "undefined") Logger.error("DynamicSpeedSlider: Required elements not found");
      else console.error("DynamicSpeedSlider: Required elements not found");
      return;
    }

    this.isInitialized = true;
    console.debug("DynamicSpeedSlider:init", {
      slider: !!this.slider,
      valueElement: !!this.valueElement,
      container: !!this.container,
    });
    this.setupEventListeners();
  }

  setupEventListeners() {
    if (!this.isInitialized) return;

    // Debounced change handler: snapshot value at event time to avoid race with later input events
    const debouncedChangeHandler = this.eventFramework.debounce(
      (value) => {
        if (this.currentSimType) {
          this.onSpeedChange(value);
        }
      },
      100,
      "dynamic-speed-debounce"
    ); // Increased from 16ms to 100ms for better performance

    // Immediate visual feedback for value display
    const immediateValueHandler = (e) => {
      const value = parseFloat(e.target.value);
      this.updateDisplay(value);
    };

    this.eventFramework.register(this.slider, "input", immediateValueHandler);
    this.eventFramework.register(this.slider, "change", (e) => {
      const value = parseFloat(e.target.value);
      // Fire immediately for responsiveness and test determinism
      console.debug("DynamicSpeedSlider:change(eventFramework)", {
        value,
        currentSimType: this.currentSimType,
        hasApp: !!this.app,
      });
      this.onSpeedChange(value);
      // Also debounce to coalesce rapid changes in real UI usage
      debouncedChangeHandler(value);
    });

    // Native fallback listener to ensure direct dispatched events are caught in all environments
    this._nativeChangeHandler = (e) => {
      const value = parseFloat(e.target.value);
      console.debug("DynamicSpeedSlider:change(native)", {
        value,
        currentSimType: this.currentSimType,
        hasApp: !!this.app,
      });
      this.onSpeedChange(value);
    };
    this.slider.addEventListener("change", this._nativeChangeHandler);

    // Property-based fallback to maximise compatibility across environments
    this._propertyChangeHandler = (e) => {
      const value = parseFloat(e.target.value);
      console.debug("DynamicSpeedSlider:change(property)", {
        value,
        currentSimType: this.currentSimType,
        hasApp: !!this.app,
      });
      this.onSpeedChange(value);
    };
    this.slider.onchange = this._propertyChangeHandler;
  }

  switchToSimulation(simType, app) {
    if (!this.isInitialized) return;

    // Only update if the simulation type has actually changed
    if (this.currentSimType === simType) return;

    console.debug("DynamicSpeedSlider:switchToSimulation:start", {
      from: this.currentSimType,
      to: simType,
    });
    this.currentSimType = simType;
    this.app = app;

    // Apply current global slider value to the newly selected simulation
    const currentValue = this.getValue();
    this.updateDisplay(currentValue);
    console.debug("DynamicSpeedSlider:switchToSimulation:onSpeedChange", {
      simType: this.currentSimType,
      value: currentValue,
      hasApp: !!this.app,
    });
    this.onSpeedChange(currentValue);

    // Show the speed control container(s) to be resilient in test environments
    const containers = document.querySelectorAll(
      ".speed-control .control-group"
    );
    containers.forEach((el) => {
      el.style.display = "block";
    });
  }

  hide() {
    if (!this.isInitialized) return;
    // Hide all matching containers to avoid duplicate DOM interference across tests
    const containers = document.querySelectorAll(
      ".speed-control .control-group"
    );
    containers.forEach((el) => {
      el.style.display = "none";
    });
  }

  updateDisplay(value) {
    if (!this.isInitialized) return;

    // Only update DOM if the value has actually changed
    const newText = `${value} steps/s`;
    if (this.valueElement.textContent !== newText) {
      this.valueElement.textContent = newText;
    }
  }

  onSpeedChange(value) {
    if (this.currentSimType && this.app) {
      // Always propagate to app; app can decide whether to ignore
      console.debug("DynamicSpeedSlider:onSpeedChange", {
        simType: this.currentSimType,
        value,
        hasApp: !!this.app,
      });
      this.app.handleSpeedChange(this.currentSimType, value);
    }
  }

  getValue() {
    if (!this.isInitialized) return 30;
    return parseFloat(this.slider.value);
  }

  setValue(value) {
    if (!this.isInitialized) return;
    this.slider.value = value;
    this.updateDisplay(value);
  }

  adjustSpeed(direction) {
    if (!this.isInitialized) return;

    const currentValue = parseFloat(this.slider.value);
    const step = 1; // Default step value
    const newValue = Math.max(
      parseInt(this.slider.min),
      Math.min(parseInt(this.slider.max), currentValue + direction * step)
    );

    this.setValue(newValue);
    this.onSpeedChange(newValue);
  }

  cleanup() {
    if (!this.isInitialized) return;

    this.eventFramework.remove(this.slider, "input");
    this.eventFramework.remove(this.slider, "change");
    if (this._nativeChangeHandler) {
      this.slider.removeEventListener("change", this._nativeChangeHandler);
      this._nativeChangeHandler = null;
    }
    if (this._propertyChangeHandler) {
      this.slider.onchange = null;
      this._propertyChangeHandler = null;
    }
    this.speedValues.clear();
    this.currentSimType = null;
    this.app = null;
  }
}

// Dynamic Fill Button - consolidates multiple random buttons into a single dynamic button
class DynamicFillButton {
  constructor(eventFramework) {
    this.eventFramework = eventFramework;
    this.currentSimType = null;
    this.app = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    this.button = this.eventFramework.getElement("#dynamic-fill-btn");
    if (!this.button) {
      if (typeof Logger !== "undefined")
        Logger.warn("Dynamic fill button not found");
      return;
    }

    this.setupEventListeners();
    this.isInitialized = true;
  }

  setupEventListeners() {
    if (!this.button) return;

    this.eventFramework.register(this.button, "click", () => {
      if (this.currentSimType && this.app) {
        this.app.handleRandomPattern(this.currentSimType);
      }
    });
  }

  switchToSimulation(simType, app) {
    this.currentSimType = simType;
    this.app = app;

    // Show button for simulations that support random patterns
    if (["conway", "termite", "langton", "reaction"].includes(simType)) {
      this.show();
    } else {
      this.hide();
    }
  }

  show() {
    if (this.button) {
      this.button.style.display = "inline-block";
    }
  }

  hide() {
    if (this.button) {
      this.button.style.display = "none";
    }
  }

  cleanup() {
    if (this.isInitialized && this.button) {
      this.eventFramework.removeAll(this.button);
    }
    this.isInitialized = false;
  }
}

/**
 * ControlVisibilityManager - CSS-based control visibility management
 * Replaces JavaScript-based show/hide logic with declarative CSS classes and data attributes
 */
class ControlVisibilityManager {
  constructor() {
    this.activeSimulation = null;
    this.controlGroups = new Map();
    this.visibilityStates = new Map();
    this.isInitialized = false;
  }

  /**
   * Initialize the visibility manager
   */
  init() {
    if (this.isInitialized) return;

    // Define control group mappings
    this.controlGroups = new Map([
      ["conway", ["conway-controls"]],
      ["termite", ["termite-controls", "termites-container"]],
      ["langton", ["langton-controls", "ants-container"]],
      ["reaction", ["reaction-controls"]],
    ]);

    // Define visibility states for each simulation
    this.visibilityStates = new Map([
      [
        "conway",
        {
          "conway-controls": "visible",
          "termite-controls": "hidden",
          "langton-controls": "hidden",
          "termites-container": "hidden",
          "reaction-controls": "hidden",
        },
      ],
      [
        "termite",
        {
          "conway-controls": "hidden",
          "termite-controls": "visible",
          "langton-controls": "hidden",
          "termites-container": "visible",
          "reaction-controls": "hidden",
        },
      ],
      [
        "langton",
        {
          "conway-controls": "hidden",
          "termite-controls": "hidden",
          "langton-controls": "visible",
          "termites-container": "hidden",
          "ants-container": "visible",
          "reaction-controls": "hidden",
        },
      ],
      [
        "reaction",
        {
          "conway-controls": "hidden",
          "termite-controls": "hidden",
          "langton-controls": "hidden",
          "termites-container": "hidden",
          "reaction-controls": "visible",
        },
      ],
    ]);

    // Add CSS classes to document if not already present
    this.ensureCSSClasses();

    this.isInitialized = true;
  }

  /**
   * Ensure required CSS classes are available
   */
  ensureCSSClasses() {
    if (document.getElementById("control-visibility-styles")) return;

    const style = document.createElement("style");
    style.id = "control-visibility-styles";
    style.textContent = `
            /* Control visibility states */
            .control-group[data-simulation="conway"] {
                display: none;
            }
            .control-group[data-simulation="termite"] {
                display: none;
            }
            .control-group[data-simulation="langton"] {
                display: none;
            }

            /* Active simulation visibility */
            .control-group[data-simulation].active {
                display: flex !important;
            }

            /* Simulation-specific control groups */
            .simulation-controls[data-simulation="conway"] {
                display: none;
            }
            .simulation-controls[data-simulation="termite"] {
                display: none;
            }
            .simulation-controls[data-simulation="langton"] {
                display: none;
            }

            .simulation-controls[data-simulation].active {
                display: flex !important;
            }

            /* Special containers */
            #termites-container[data-simulation="termite"].active {
                display: block !important;
            }
            #termites-container[data-simulation]:not(.active) {
                display: none !important;
            }
        `;

    document.head.appendChild(style);
  }

  /**
   * Set the active simulation and update visibility
   * @param {string} simType - The simulation type to activate
   */
  setActiveSimulation(simType) {
    if (!this.isInitialized) {
      this.init();
    }

    // Remove active class from all control groups
    this.clearActiveStates();

    // Set new active simulation
    this.activeSimulation = simType;

    // Apply visibility states for the active simulation
    this.applyVisibilityStates(simType);

    // Trigger layout repositioning if needed
    if (window.layoutManager) {
      setTimeout(() => window.layoutManager.repositionElements(), 50);
    }
  }

  /**
   * Clear all active states from control groups
   */
  clearActiveStates() {
    // Clear from simulation controls
    document
      .querySelectorAll(".simulation-controls[data-simulation]")
      .forEach((element) => {
        element.classList.remove("active");
      });

    // Clear from special containers
    document
      .querySelectorAll("#termites-container[data-simulation]")
      .forEach((element) => {
        element.classList.remove("active");
      });

    // Clear from control groups
    document
      .querySelectorAll(".control-group[data-simulation]")
      .forEach((element) => {
        element.classList.remove("active");
      });

    // Defensive: also clear from known control IDs even if data-simulation is missing
    const knownIds = [
      "conway-controls",
      "termite-controls",
      "langton-controls",
      "termites-container",
      "reaction-controls",
    ];
    knownIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.remove("active");
    });
  }

  /**
   * Apply visibility states for a specific simulation
   * @param {string} simType - The simulation type
   */
  applyVisibilityStates(simType) {
    const states = this.visibilityStates.get(simType);
    if (!states) return;

    Object.entries(states).forEach(([elementId, visibility]) => {
      const element = document.getElementById(elementId);
      if (element) {
        if (visibility === "visible") {
          element.setAttribute("data-simulation", simType);
          element.classList.add("active");
        } else {
          element.classList.remove("active");
        }
      }
    });
  }

  /**
   * Show controls for a specific simulation (backward compatibility)
   * @param {string} simType - The simulation type
   */
  showControls(simType) {
    this.setActiveSimulation(simType);
  }

  /**
   * Hide all controls (backward compatibility)
   */
  hideAllControls() {
    this.clearActiveStates();
    this.activeSimulation = null;
  }

  /**
   * Get the currently active simulation
   * @returns {string|null} The active simulation type
   */
  getActiveSimulation() {
    return this.activeSimulation;
  }

  /**
   * Check if a control group is visible for the current simulation
   * @param {string} elementId - The element ID to check
   * @returns {boolean} True if visible
   */
  isControlVisible(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return false;

    return element.classList.contains("active");
  }

  /**
   * Add a new control group mapping
   * @param {string} simType - The simulation type
   * @param {Array<string>} controlIds - Array of control element IDs
   */
  addControlGroup(simType, controlIds) {
    this.controlGroups.set(simType, controlIds);
  }

  /**
   * Add visibility states for a new simulation
   * @param {string} simType - The simulation type
   * @param {Object} states - Visibility states object
   */
  addVisibilityStates(simType, states) {
    this.visibilityStates.set(simType, states);
  }

  /**
   * Cleanup the visibility manager
   */
  cleanup() {
    this.clearActiveStates();
    this.controlGroups.clear();
    this.visibilityStates.clear();
    this.activeSimulation = null;
    this.isInitialized = false;
  }
}

// Centralised performance utilities
class PerformanceUtils {
  static #globalDebounceTimers = new Map();
  static #globalThrottleTimers = new Map();

  // Debounce with optional shared store (Map) and key
  static debounce(func, wait, key = null, store = null) {
    const timerStore = store || PerformanceUtils.#globalDebounceTimers;
    const timerKey = key || func;
    return (...args) => {
      const existing = timerStore.get(timerKey);
      if (existing) clearTimeout(existing);
      const timeout = setTimeout(() => {
        timerStore.delete(timerKey);
        func.apply(this, args);
      }, wait);
      timerStore.set(timerKey, timeout);
    };
  }

  // Throttle with optional shared store (Map) and key
  static throttle(func, limit, key = null, store = null) {
    const timerStore = store || PerformanceUtils.#globalThrottleTimers;
    const timerKey = key || func;
    return (...args) => {
      if (!timerStore.has(timerKey)) {
        func.apply(this, args);
        timerStore.set(timerKey, true);
        setTimeout(() => {
          timerStore.delete(timerKey);
        }, limit);
      }
    };
  }
}

// Backwards-compatible PerformanceOptimizer delegating to PerformanceUtils
class PerformanceOptimizer {
  static debounce(func, wait) {
    return PerformanceUtils.debounce(func, wait);
  }

  static throttle(func, limit) {
    return PerformanceUtils.throttle(func, limit);
  }

  static createElementCache() {
    const cache = new Map();
    return {
      get: (selector) => {
        if (!cache.has(selector)) {
          cache.set(selector, document.querySelector(selector));
        }
        return cache.get(selector);
      },
      clear: () => cache.clear(),
    };
  }

  static createEventListenerManager() {
    const listeners = new Map();
    return {
      add: (element, event, handler, options = {}) => {
        const key = `${element.id || "anonymous"}-${event}`;
        if (listeners.has(key)) {
          element.removeEventListener(event, listeners.get(key), options);
        }
        listeners.set(key, handler);
        element.addEventListener(event, handler, options);
      },
      remove: (element, event) => {
        const key = `${element.id || "anonymous"}-${event}`;
        const handler = listeners.get(key);
        if (handler) {
          element.removeEventListener(event, handler);
          listeners.delete(key);
        }
      },
      clear: () => {
        listeners.clear();
      },
    };
  }
}

/**
 * EventHandlerFactory - Consolidates event handler registration patterns
 * Eliminates duplication in event handler creation and registration
 */
class EventHandlerFactory {
  constructor(eventFramework) {
    this.eventFramework = eventFramework;
    this.handlerTemplates = new Map();
    this.registeredHandlers = new Map();
    this.initHandlerTemplates();
  }

  /**
   * Initialize standard handler templates
   */
  initHandlerTemplates() {
    // Slider handler templates
    this.handlerTemplates.set("slider", {
      input: this.createSliderInputHandler.bind(this),
      change: this.createSliderChangeHandler.bind(this),
    });

    // Button handler templates
    this.handlerTemplates.set("button", {
      click: this.createButtonClickHandler.bind(this),
    });

    // Simulation-specific handler templates
    this.handlerTemplates.set("simulation", {
      speedChange: this.createSpeedChangeHandler.bind(this),
      randomPattern: this.createRandomPatternHandler.bind(this),
      showLearnModal: this.createShowLearnModalHandler.bind(this),
      addAnt: this.createAddAntHandler.bind(this),
      termiteCountChange: this.createTermiteCountChangeHandler.bind(this),
      antCountChange: this.createAntCountChangeHandler.bind(this),
      brightnessChange: this.createBrightnessChangeHandler.bind(this),
      likelihoodChange: this.createLikelihoodChangeHandler.bind(this),
      reactionParamChange: this.createReactionParamChangeHandler.bind(this),
    });
  }

  /**
   * Create simulation-specific handlers with context injection
   * @param {string} simType - The simulation type
   * @param {Object} app - The main application instance
   * @returns {Object} Object containing all simulation handlers
   */
  createSimulationHandlers(simType, app) {
    const handlers = {
      speedChange: (value) => app.handleSpeedChange(simType, value),
      randomPattern: () => app.handleRandomPattern(simType),
      showLearnModal: () => app.showLearnModal(), // No simType parameter needed
      addAnt: () => app.handleAddAnt(simType),
      termiteCountChange: (count) => app.handleTermiteCountChange(count),
      antCountChange: (count) => app.handleAntCountChange(count),
      brightnessChange: (value) => app.setBrightness(value),
      likelihoodChange: (value) => app.setLikelihood(value),
      reactionParamChange: (name, value) =>
        app.handleReactionParamChange(name, value),
    };

    // Store handlers for cleanup
    this.registeredHandlers.set(simType, handlers);
    return handlers;
  }

  /**
   * Create slider input handler with immediate visual feedback
   * @param {Object} config - Slider configuration
   * @param {Object} handlers - Simulation handlers
   * @returns {Function} Input event handler
   */
  createSliderInputHandler(config, handlers) {
    return (e) => {
      const value = config.format
        ? config.format(e.target.value)
        : e.target.value;
      const valueElement = this.eventFramework.getElement(
        `#${config.valueElementId}`
      );
      if (valueElement) {
        valueElement.textContent = value;
      }
    };
  }

  /**
   * Create slider change handler with debounced processing
   * @param {Object} config - Slider configuration
   * @param {Object} handlers - Simulation handlers
   * @returns {Function} Change event handler
   */
  createSliderChangeHandler(config, handlers) {
    return this.eventFramework.debounce(
      (e) => {
        const value = config.format
          ? config.format(e.target.value)
          : e.target.value;
        const valueElement = this.eventFramework.getElement(
          `#${config.valueElementId}`
        );
        if (valueElement) {
          valueElement.textContent = value;
        }

        // Route to appropriate handler based on control type
        if (config.id.includes("speed")) {
          handlers.speedChange(parseFloat(e.target.value));
        } else if (config.id.includes("termites")) {
          handlers.termiteCountChange(parseInt(e.target.value));
        } else if (config.id.includes("ants")) {
          handlers.antCountChange(parseInt(e.target.value));
        } else if (config.id.includes("brightness")) {
          handlers.brightnessChange(parseFloat(e.target.value));
        } else if (config.id.includes("likelihood")) {
          handlers.likelihoodChange(parseInt(e.target.value));
        } else if (config.id.includes("reaction-feed")) {
          handlers.reactionParamChange("feed", parseFloat(e.target.value));
        } else if (config.id.includes("reaction-kill")) {
          handlers.reactionParamChange("kill", parseFloat(e.target.value));
        }
      },
      16,
      `${config.id}-debounce`
    );
  }

  /**
   * Create button click handler with conditional routing
   * @param {Object} config - Button configuration
   * @param {Object} handlers - Simulation handlers
   * @returns {Function} Click event handler
   */
  createButtonClickHandler(config, handlers) {
    return () => {
      if (config.id.includes("learn")) {
        handlers.showLearnModal();
      } else if (config.id.includes("add-ant")) {
        handlers.addAnt();
      } else if (config.id.includes("random") || config.id.includes("fill")) {
        handlers.randomPattern();
      }
    };
  }

  /**
   * Create speed change handler with simulation context
   * @param {string} simType - Simulation type
   * @param {Object} app - Application instance
   * @returns {Function} Speed change handler
   */
  createSpeedChangeHandler(simType, app) {
    return (value) => app.handleSpeedChange(simType, value);
  }

  /**
   * Create random pattern handler with simulation context
   * @param {string} simType - Simulation type
   * @param {Object} app - Application instance
   * @returns {Function} Random pattern handler
   */
  createRandomPatternHandler(simType, app) {
    return () => app.handleRandomPattern(simType);
  }

  /**
   * Create show learn modal handler with simulation context
   * @param {string} simType - Simulation type
   * @param {Object} app - Application instance
   * @returns {Function} Show learn modal handler
   */
  createShowLearnModalHandler(simType, app) {
    return () => app.showLearnModal(simType);
  }

  /**
   * Create add ant handler with simulation context
   * @param {string} simType - Simulation type
   * @param {Object} app - Application instance
   * @returns {Function} Add ant handler
   */
  createAddAntHandler(simType, app) {
    return () => app.handleAddAnt(simType);
  }

  /**
   * Create termite count change handler
   * @param {Object} app - Application instance
   * @returns {Function} Termite count change handler
   */
  createTermiteCountChangeHandler(app) {
    return (count) => app.handleTermiteCountChange(count);
  }

  /**
   * Create ant count change handler
   * @param {Object} app - Application instance
   * @returns {Function} Ant count change handler
   */
  createAntCountChangeHandler(app) {
    return (count) => app.handleAntCountChange(count);
  }

  /**
   * Create reaction parameter change handler
   * @param {Object} app - Application instance
   * @returns {Function} Reaction parameter change handler
   */
  createReactionParamChangeHandler(app) {
    return (name, value) => app.handleReactionParamChange(name, value);
  }

  /**
   * Create brightness change handler
   * @param {Object} app - Application instance
   * @returns {Function} Brightness change handler
   */
  createBrightnessChangeHandler(app) {
    return (value) => app.setBrightness(value);
  }

  /**
   * Create likelihood change handler
   * @param {Object} app - Application instance
   * @returns {Function} Likelihood change handler
   */
  createLikelihoodChangeHandler(app) {
    return (value) => app.setLikelihood(value);
  }

  /**
   * Setup slider control with factory-generated handlers
   * @param {Object} config - Slider configuration
   * @param {Object} handlers - Simulation handlers
   */
  setupSlider(config, handlers) {
    const slider = this.eventFramework.getElement(`#${config.id}`);
    if (!slider) return;

    const inputHandler = this.createSliderInputHandler(config, handlers);
    const changeHandler = this.createSliderChangeHandler(config, handlers);

    this.eventFramework.register(slider, "input", inputHandler);
    this.eventFramework.register(slider, "change", changeHandler);
  }

  /**
   * Setup button control with factory-generated handlers
   * @param {Object} config - Button configuration
   * @param {Object} handlers - Simulation handlers
   */
  setupButton(config, handlers) {
    const button = this.eventFramework.getElement(`#${config.id}`);
    if (!button) return;

    const clickHandler = this.createButtonClickHandler(config, handlers);
    this.eventFramework.register(button, "click", clickHandler);
  }

  /**
   * Setup controls for a simulation type using factory-generated handlers
   * @param {string} simType - Simulation type
   * @param {Object} handlers - Simulation handlers
   */
  setupControls(simType, handlers) {
    const config = ConfigurationManager.getConfig(simType);
    if (!config || !config.controls) return;

    Object.entries(config.controls).forEach(([controlName, controlConfig]) => {
      if (controlConfig.type === "slider") {
        this.setupSlider(controlConfig, handlers);
      } else if (controlConfig.type === "button") {
        this.setupButton(controlConfig, handlers);
      }
      // Dynamic controls are handled by their own classes
    });
  }

  /**
   * Register all simulation handlers using factory
   * @param {Object} app - Application instance
   */
  registerAllSimulationHandlers(app) {
    Object.keys(ConfigurationManager.getAllConfigs()).forEach((simType) => {
      const handlers = this.createSimulationHandlers(simType, app);
      this.setupControls(simType, handlers);
    });
  }

  /**
   * Create custom handler with context injection
   * @param {string} handlerType - Type of handler to create
   * @param {Object} context - Context object to inject
   * @param {Function} handlerFunction - Base handler function
   * @returns {Function} Context-injected handler
   */
  createCustomHandler(handlerType, context, handlerFunction) {
    return (...args) => {
      return handlerFunction.call(context, ...args);
    };
  }

  /**
   * Create batch event registration
   * @param {Array} registrations - Array of registration objects
   */
  createBatchRegistration(registrations) {
    const batch = registrations
      .map((reg) => ({
        element: this.eventFramework.getElement(reg.selector),
        event: reg.event,
        handler: reg.handler,
        options: reg.options || {},
      }))
      .filter((reg) => reg.element);

    this.eventFramework.registerBatch(batch);
  }

  /**
   * Cleanup all registered handlers
   */
  cleanup() {
    // Clear registered handlers and templates
    this.registeredHandlers.clear();
    this.handlerTemplates.clear();
  }

  /**
   * Get registered handlers for a simulation type
   * @param {string} simType - Simulation type
   * @returns {Object|null} Registered handlers or null
   */
  getRegisteredHandlers(simType) {
    return this.registeredHandlers.get(simType) || null;
  }

  /**
   * Check if handlers are registered for a simulation type
   * @param {string} simType - Simulation type
   * @returns {boolean} True if handlers are registered
   */
  hasRegisteredHandlers(simType) {
    return this.registeredHandlers.has(simType);
  }
}

// Application metadata loader and footer renderer for Learn modals
class AppMetadataLoader {
  static cache = null;
  static loadingPromise = null;

  static async loadMetadata() {
    if (this.cache) return this.cache;
    if (this.loadingPromise) return this.loadingPromise;

    const readTextSafe = async (path) => {
      try {
        const res = await fetch(path, { cache: "no-store" });
        if (!res.ok) throw new Error("not ok");
        return await res.text();
      } catch (_) {
        return null;
      }
    };

    this.loadingPromise = (async () => {
      const [readme, version, licensePreferred, licenseFallback] =
        await Promise.all([
          readTextSafe("README.md"),
          readTextSafe("VERSION"),
          readTextSafe("LICENSE"),
          readTextSafe("LICENCE"),
        ]);

      const name =
        this.parseNameFromReadme(readme) || "Algorithmic Pattern Generator";
      const build = (version && version.trim()) || "dev";
      const licenceText = licensePreferred || licenseFallback;
      const licenceName =
        this.parseLicenceName(licenceText) || "Unknown licence";

      const meta = { name, build, licenceName };
      this.cache = meta;
      this.loadingPromise = null;
      return meta;
    })();

    return this.loadingPromise;
  }

  static parseNameFromReadme(text) {
    if (!text) return null;
    const lines = text.split(/\r?\n/);
    const h1 = lines.find((l) => /^#\s+/.test(l));
    return h1 ? h1.replace(/^#\s+/, "").trim() : null;
  }

  static parseLicenceName(text) {
    if (!text) return null;
    const firstLine = text.split(/\r?\n/)[0] || "";
    const candidates = [firstLine, text];
    const match = candidates.find((t) =>
      /(MIT|Apache|GPL|BSD|MPL|Unlicense|ISC)/i.test(t)
    );
    return (match && match.trim()) || firstLine.trim() || null;
  }

  static renderFooterHTML(meta) {
    const safe = (s) =>
      String(s || "").replace(
        /[<>&]/g,
        (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c])
      );
    return `
      <div class="modal-divider" aria-hidden="true"></div>
      <div class="modal-footer meta" role="contentinfo">
        <span class="app-meta">
          ${safe(
            meta.name
          )} • <a href="https://github.com/warwickallen/algorithmic-pattern-generator#algorithmic-pattern-generator" target="_blank" rel="noopener noreferrer">About</a> • Build ${safe(
      meta.build
    )} • ${safe(meta.licenceName)}
        </span>
      </div>
    `;
  }

  static appendFooter(containerElement) {
    if (!containerElement) return;
    // Create a placeholder footer immediately to avoid layout shift
    const wrapper = document.createElement("div");
    wrapper.className = "modal-meta-wrapper";
    wrapper.innerHTML = `
      <div class="modal-divider" aria-hidden="true"></div>
      <div class="modal-footer meta" role="contentinfo">
        <span class="app-meta">Loading application details…</span>
      </div>
    `;
    containerElement.appendChild(wrapper);

    // Load and replace content asynchronously
    this.loadMetadata().then((meta) => {
      try {
        wrapper.innerHTML = this.renderFooterHTML(meta);
      } catch (_) {
        // keep placeholder on failure
      }
    });
  }
}

class ModalTemplateManager {
  constructor() {
    this.modalTemplates = new Map();
    this.contentTemplates = new Map();
    this.init();
  }

  init() {
    this.setupBaseTemplates();
    this.setupContentTemplates();
  }

  setupBaseTemplates() {
    // Base modal structure template
    this.baseModalTemplate = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 data-title></h2>
                    <button class="modal-close" data-close-btn>&times;</button>
                </div>
                <div class="modal-body" data-content>
                    <!-- Content will be injected here -->
                </div>
            </div>
        `;
  }

  setupContentTemplates() {
    // Conway's Game of Life content template
    this.contentTemplates.set("conway", {
      title: "Conway's Game of Life",
      content: `
                <h3>Rules</h3>
                <p>Conway's Game of Life is a cellular automaton with simple rules:</p>
                <ul>
                    <li><strong>Birth:</strong> A dead cell with exactly 3 live neighbours becomes alive</li>
                    <li><strong>Survival:</strong> A live cell with 2 or 3 live neighbours stays alive</li>
                    <li><strong>Death:</strong> A live cell with fewer than 2 or more than 3 neighbours dies</li>
                </ul>

                <h3>Common Patterns</h3>
                <ul>
                    <li><strong>Still Life:</strong> Patterns that don't change (e.g., Block, Beehive)</li>
                    <li><strong>Oscillators:</strong> Patterns that repeat after a few generations (e.g., Blinker, Toad)</li>
                    <li><strong>Spaceships:</strong> Patterns that move across the grid (e.g., Glider)</li>
                </ul>

                <h3>Historical Context</h3>
                <p>Conway's Game of Life was created by mathematician John Conway in 1970. It was designed to demonstrate how complex patterns could emerge from simple rules, and it became one of the most famous examples of cellular automata. The game has inspired research in:</p>
                <ul>
                    <li>Artificial life and emergent behaviour</li>
                    <li>Computational complexity and universality</li>
                    <li>Pattern formation in nature and mathematics</li>
                    <li>Self-replicating systems and evolution</li>
                </ul>

                <h3>How to Use</h3>
                <p>Click on the grid to toggle cells between alive and dead states. Use the controls to start, pause, and reset the simulation.</p>
            `,
    });

    // Termite Algorithm content template
    this.contentTemplates.set("termite", {
      title: "Termite Algorithm",
      content: `
                <h3>How It Works</h3>
                <p>The Termite Algorithm demonstrates emergent behaviour through simple rules:</p>
                <ul>
                    <li><strong>Movement:</strong> Termites move randomly across the grid</li>
                    <li><strong>Pick Up:</strong> If a termite encounters a wood chip and isn't carrying one, it picks it up</li>
                    <li><strong>Drop:</strong> If a termite is carrying a chip and encounters an empty space, it drops the chip</li>
                    <li><strong>Direction:</strong> Termites occasionally change direction randomly</li>
                </ul>

                <h3>Emergent Behaviour</h3>
                <p>Despite simple individual rules, termites collectively create organised patterns:</p>
                <ul>
                    <li><strong>Clustering:</strong> Wood chips gradually form clusters</li>
                    <li><strong>Self-Organisation:</strong> Random distribution becomes structured over time</li>
                    <li><strong>Stability:</strong> Once clusters form, they tend to remain stable</li>
                </ul>

                <h3>Real-World Applications</h3>
                <p>This algorithm has inspired research in:</p>
                <ul>
                    <li>Swarm robotics and collective behaviour</li>
                    <li>Resource distribution and optimisation</li>
                    <li>Self-organising systems and emergent intelligence</li>
                </ul>

                <h3>Controls</h3>
                <p>Use the speed slider to control termite movement speed, the termites slider to adjust the number of termites, and the random button to create a new random distribution of wood chips.</p>
            `,
    });

    // Langton's Ant content template
    this.contentTemplates.set("langton", {
      title: "Langton's Ant",
      content: `
                <h3>Rules</h3>
                <p>Langton's Ant follows simple rules that create complex emergent behaviour:</p>
                <ul>
                    <li><strong>White Cell:</strong> Turn 90° right, flip the cell to black, move forward</li>
                    <li><strong>Black Cell:</strong> Turn 90° left, flip the cell to white, move forward</li>
                    <li><strong>Movement:</strong> The ant always moves one cell in the direction it's facing</li>
                </ul>

                <h3>Highway Formation</h3>
                <p>After an initial chaotic period, the ant typically forms a "highway" pattern:</p>
                <ul>
                    <li><strong>Chaotic Phase:</strong> The ant moves in seemingly random patterns</li>
                    <li><strong>Highway Phase:</strong> The ant creates a repeating diagonal pattern</li>
                    <li><strong>Predictability:</strong> Once the highway forms, the ant's path becomes predictable</li>
                </ul>

                <h3>Mathematical Significance</h3>
                <p>Langton's Ant demonstrates important concepts in:</p>
                <ul>
                    <li><strong>Emergence:</strong> Complex patterns from simple rules</li>
                    <li><strong>Deterministic Chaos:</strong> Predictable rules creating unpredictable initial behaviour</li>
                    <li><strong>Self-Organisation:</strong> Order emerging from disorder</li>
                    <li><strong>Computational Universality:</strong> The ant can simulate a Turing machine</li>
                </ul>

                <h3>Controls</h3>
                <p>Use the speed slider to control ant movement speed, the Add Ant button (or press 'a') to add new ants, and the random button to create a random pattern of white and black cells.</p>
            `,
    });

    // Reaction–Diffusion content template
    this.contentTemplates.set("reaction", {
      title: "Reaction–Diffusion (Gray–Scott)",
      content: `
                <h3>How It Works</h3>
                <p>The Gray–Scott model simulates two chemicals (U and V) that diffuse and react to form Turing patterns.</p>
                <ul>
                    <li><strong>Diffusion:</strong> U and V spread to neighbouring cells</li>
                    <li><strong>Reaction:</strong> U + 2V → 3V converts U to V where V exists</li>
                    <li><strong>Feed/kill:</strong> U is fed in, V is removed, stabilising patterns</li>
                </ul>
                <h3>Patterns</h3>
                <p>By tuning feed and kill rates, stripes, spots, and labyrinths emerge.</p>
                <h3>Controls</h3>
                <p>Use Speed and Fill (coverage) to reseed random V regions. Click/drag on the canvas to seed V locally.</p>
            `,
    });
  }

  createModalContent(simType) {
    const template = this.contentTemplates.get(simType);
    if (!template) {
      if (typeof Logger !== "undefined") Logger.warn(`No content template found for simulation type: ${simType}`);
      else console.warn(`No content template found for simulation type: ${simType}`);
      return null;
    }

    // Create modal structure with content
    const modalHTML = this.baseModalTemplate
      .replace("[data-title]", template.title)
      .replace("[data-close-btn]", "")
      .replace("[data-content]", template.content);

    return {
      title: template.title,
      content: modalHTML,
    };
  }

  generateModalHTML(simType) {
    const content = this.createModalContent(simType);
    if (!content) return null;

    return `
            <div id="${simType}-modal" class="modal">
                ${content.content}
            </div>
        `;
  }

  injectModalContent(simType, modalElement) {
    const template = this.contentTemplates.get(simType);
    if (!template || !modalElement) return false;

    // Update title using data attribute for more robust selection
    const titleElement = modalElement.querySelector("[data-modal-title]");
    if (titleElement) {
      titleElement.textContent = template.title;
    }

    // Update content using data attribute for more robust selection
    const contentElement = modalElement.querySelector("[data-modal-content]");
    if (contentElement) {
      // Inject main educational content
      contentElement.innerHTML = template.content;
      // Remove any previous footer wrapper to avoid duplicates on reinjection
      const previous = contentElement.querySelector(".modal-meta-wrapper");
      if (previous && previous.parentNode === contentElement) {
        contentElement.removeChild(previous);
      }
      // Append footer (divider + metadata) at the end
      if (typeof AppMetadataLoader !== "undefined") {
        AppMetadataLoader.appendFooter(contentElement);
      }
    }

    return true;
  }

  addContentTemplate(simType, template) {
    if (!template.title || !template.content) {
      if (typeof Logger !== "undefined") Logger.error("Template must have title and content properties");
      else console.error("Template must have title and content properties");
      return false;
    }

    this.contentTemplates.set(simType, template);
    return true;
  }

  getAvailableSimulations() {
    return Array.from(this.contentTemplates.keys());
  }

  hasTemplate(simType) {
    return this.contentTemplates.has(simType);
  }

  cleanup() {
    this.modalTemplates.clear();
    this.contentTemplates.clear();
  }
}

// Control Template Manager for Simulation Control Configuration Consolidation
class ControlTemplateManager {
  // Base templates for common control types
  static baseTemplates = {
    dynamicSpeedSlider: {
      type: "dynamicSlider",
      min:
        typeof AppConstants !== "undefined"
          ? AppConstants.UISliders.SPEED.min
          : 1,
      max:
        typeof AppConstants !== "undefined"
          ? AppConstants.UISliders.SPEED.max
          : 60,
      step:
        typeof AppConstants !== "undefined"
          ? AppConstants.UISliders.SPEED.step
          : 1,
      value:
        typeof AppConstants !== "undefined"
          ? AppConstants.UISliders.SPEED.value
          : 30,
      label: "Speed",
      format: (value) => `${value} steps/s`,
      id: "dynamic-speed-slider",
      valueElementId: "dynamic-speed-value",
    },
    dynamicFillButton: {
      type: "dynamicButton",
      label: "Fill",
    },
    learnButton: {
      type: "button",
      label: "Learn",
    },
    addAntButton: {
      type: "button",
      label: "Add Ant",
    },
    actorCountSlider: {
      type: "slider",
      min: 1,
      max: 100,
      step: 1,
      value: 1,
      label: "Ants",
      format: (value) => value.toString(),
    },
    termiteCountSlider: {
      type: "slider",
      min:
        typeof AppConstants !== "undefined"
          ? AppConstants.UISliders.TERMITES.min
          : 10,
      max:
        typeof AppConstants !== "undefined"
          ? AppConstants.UISliders.TERMITES.max
          : 100,
      step:
        typeof AppConstants !== "undefined"
          ? AppConstants.UISliders.TERMITES.step
          : 1,
      value:
        typeof AppConstants !== "undefined"
          ? AppConstants.UISliders.TERMITES.value
          : 50,
      label: "Termites",
      format: (value) => value.toString(),
    },
    reactionFeedSlider: {
      type: "slider",
      min: 0.0,
      max: 0.1,
      step: 0.001,
      value: 0.06,
      label: "Feed (F)",
      format: (value) => parseFloat(value).toFixed(3),
    },
    reactionKillSlider: {
      type: "slider",
      min: 0.0,
      max: 0.1,
      step: 0.001,
      value: 0.062,
      label: "Kill (k)",
      format: (value) => parseFloat(value).toFixed(3),
    },
  };

  // Simulation-specific control configurations with overrides
  static simulationControlTemplates = {
    conway: {
      controls: {
        // Speed control handled by DynamicSpeedSlider
        // Fill button handled by DynamicFillButton
        learn: {
          template: "learnButton",
          id: "learn-btn",
        },
      },
    },
    termite: {
      controls: {
        // Speed control handled by DynamicSpeedSlider
        termiteCount: {
          template: "termiteCountSlider",
          id: "termites-slider",
          valueElementId: "termites-value",
        },
        // Fill button handled by DynamicFillButton
        learn: {
          template: "learnButton",
          id: "learn-btn",
        },
      },
    },
    langton: {
      controls: {
        // Speed control handled by DynamicSpeedSlider
        antCount: {
          template: "actorCountSlider",
          id: "ants-slider",
          valueElementId: "ants-value",
        },
        // Fill button handled by DynamicFillButton
        learn: {
          template: "learnButton",
          id: "learn-btn",
        },
      },
    },
    reaction: {
      controls: {
        // Speed via DynamicSpeedSlider, Fill via DynamicFillButton
        learn: {
          template: "learnButton",
          id: "learn-btn",
        },
        reactionFeed: {
          template: "reactionFeedSlider",
          id: "reaction-feed-slider",
          valueElementId: "reaction-feed-value",
        },
        reactionKill: {
          template: "reactionKillSlider",
          id: "reaction-kill-slider",
          valueElementId: "reaction-kill-value",
        },
      },
    },
  };

  // Generate complete control configuration from templates
  static generateControlConfig(simType, controlName) {
    const simTemplate = this.simulationControlTemplates[simType];
    if (!simTemplate || !simTemplate.controls[controlName]) {
      throw new Error(
        `Control template not found for ${simType}.${controlName}`
      );
    }

    const controlTemplate = simTemplate.controls[controlName];
    const baseTemplate = this.baseTemplates[controlTemplate.template];

    if (!baseTemplate) {
      throw new Error(`Base template not found: ${controlTemplate.template}`);
    }

    // Merge base template with simulation-specific overrides
    return {
      ...baseTemplate,
      ...controlTemplate,
    };
  }

  // Generate complete simulation configuration
  static generateSimulationConfig(simType) {
    const simTemplate = this.simulationControlTemplates[simType];
    if (!simTemplate) {
      throw new Error(`Simulation template not found: ${simType}`);
    }

    const controls = {};
    Object.keys(simTemplate.controls).forEach((controlName) => {
      controls[controlName] = this.generateControlConfig(simType, controlName);
    });

    return {
      name: this.getSimulationName(simType),
      controls,
      modal: this.getModalConfig(simType),
    };
  }

  // Get simulation name
  static getSimulationName(simType) {
    const names = {
      conway: "Conway's Game of Life",
      termite: "Termite Algorithm",
      langton: "Langton's Ant",
      reaction: "Reaction–Diffusion",
    };
    return names[simType] || simType;
  }

  // Get modal configuration
  static getModalConfig(simType) {
    // All simulations now use the dynamic modal
    return {
      id: "dynamic-modal",
      closeId: "dynamic-modal-close",
    };
  }

  // Get all simulation configurations
  static getAllSimulationConfigs() {
    const configs = {};
    Object.keys(this.simulationControlTemplates).forEach((simType) => {
      configs[simType] = this.generateSimulationConfig(simType);
    });
    return configs;
  }

  // Add new simulation template
  static addSimulationTemplate(simType, template) {
    this.simulationControlTemplates[simType] = template;
  }

  // Add new base template
  static addBaseTemplate(templateName, template) {
    this.baseTemplates[templateName] = template;
  }

  // Validate template configuration
  static validateTemplate(template) {
    if (!template.controls || typeof template.controls !== "object") {
      throw new Error("Template must have controls object");
    }

    Object.entries(template.controls).forEach(
      ([controlName, controlConfig]) => {
        if (!controlConfig.template) {
          throw new Error(
            `Control ${controlName} must have a template reference`
          );
        }
        if (!this.baseTemplates[controlConfig.template]) {
          throw new Error(`Base template not found: ${controlConfig.template}`);
        }
      }
    );
  }
}

// Unified Configuration Manager
class ConfigurationManager {
  static simulationConfigs = null;

  static getConfig(simType) {
    if (!this.simulationConfigs) {
      this.simulationConfigs = ControlTemplateManager.getAllSimulationConfigs();
    }
    return this.simulationConfigs[simType];
  }

  static getAllConfigs() {
    if (!this.simulationConfigs) {
      this.simulationConfigs = ControlTemplateManager.getAllSimulationConfigs();
    }
    return this.simulationConfigs;
  }

  // Factory methods for creating standardized configurations (R2 Implementation)
  static createSliderConfig(
    id,
    valueElementId,
    min,
    max,
    step,
    value,
    label,
    format = null
  ) {
    return {
      type: "slider",
      id,
      valueElementId,
      min,
      max,
      step,
      value,
      label,
      format: format || ((val) => val.toString()),
    };
  }

  static createButtonConfig(id, label, className = "btn secondary") {
    return {
      type: "button",
      id,
      label,
      className,
    };
  }

  static createModalConfig(id, closeId, onShow = null, onHide = null) {
    return {
      id,
      closeId,
      onShow,
      onHide,
    };
  }

  static createSimulationConfig(name, controls, modal) {
    return {
      name,
      controls,
      modal,
    };
  }

  // Validation methods
  static validateSliderConfig(config) {
    if (typeof ConfigValidator !== "undefined") {
      return ConfigValidator.validate("slider", { type: "slider", ...config })
        .valid;
    }
    const required = [
      "id",
      "valueElementId",
      "min",
      "max",
      "step",
      "value",
      "label",
    ];
    return required.every((prop) =>
      Object.prototype.hasOwnProperty.call(config, prop)
    );
  }

  static validateButtonConfig(config) {
    if (typeof ConfigValidator !== "undefined") {
      return ConfigValidator.validate("button", { type: "button", ...config })
        .valid;
    }
    const required = ["id", "label"];
    return required.every((prop) =>
      Object.prototype.hasOwnProperty.call(config, prop)
    );
  }

  static validateModalConfig(config) {
    if (typeof ConfigValidator !== "undefined") {
      return ConfigValidator.validate("modal", config).valid;
    }
    const required = ["id", "closeId"];
    return required.every((prop) =>
      Object.prototype.hasOwnProperty.call(config, prop)
    );
  }

  static validateSimulationConfig(config) {
    if (typeof ConfigValidator !== "undefined") {
      return ConfigValidator.validate("simulation", config).valid;
    }
    const required = ["name", "controls", "modal"];
    return required.every((prop) =>
      Object.prototype.hasOwnProperty.call(config, prop)
    );
  }

  // Factory method to create a complete simulation configuration
  static createCompleteSimulationConfig(
    simType,
    name,
    controlConfigs,
    modalConfig
  ) {
    const controls = {};

    // Process control configurations
    Object.entries(controlConfigs).forEach(([controlName, controlConfig]) => {
      if (controlConfig.type === "slider") {
        if (typeof ConfigValidator !== "undefined") {
          ConfigValidator.assert("slider", {
            type: "slider",
            ...controlConfig,
          });
        } else if (!this.validateSliderConfig(controlConfig)) {
          throw new Error(
            `Invalid slider config for ${simType}.${controlName}`
          );
        }
      } else if (controlConfig.type === "button") {
        if (typeof ConfigValidator !== "undefined") {
          ConfigValidator.assert("button", {
            type: "button",
            ...controlConfig,
          });
        } else if (!this.validateButtonConfig(controlConfig)) {
          throw new Error(
            `Invalid button config for ${simType}.${controlName}`
          );
        }
      }
      controls[controlName] = controlConfig;
    });

    // Validate modal configuration
    if (!this.validateModalConfig(modalConfig)) {
      throw new Error(`Invalid modal config for ${simType}`);
    }

    const simulationConfig = this.createSimulationConfig(
      name,
      controls,
      modalConfig
    );

    if (!this.validateSimulationConfig(simulationConfig)) {
      throw new Error(`Invalid simulation config for ${simType}`);
    }

    return simulationConfig;
  }

  // Regenerate configurations from templates (useful for dynamic updates)
  static regenerateConfigs() {
    this.simulationConfigs = ControlTemplateManager.getAllSimulationConfigs();
  }
}

// Event Handling Framework (R1 Implementation)
class EventFramework {
  constructor() {
    this.listeners = new Map();
    this.debounceTimers = new Map();
    this.throttleTimers = new Map();
    this.elementCache = new Map();
  }

  // Unified event registration with automatic cleanup
  register(element, event, handler, options = {}) {
    const key = this.createListenerKey(element, event);

    // Remove existing listener if present
    this.remove(element, event);

    // Store listener for cleanup
    this.listeners.set(key, { element, event, handler, options });

    // Add event listener
    element.addEventListener(event, handler, options);

    return key;
  }

  // Remove specific event listener
  remove(element, event) {
    const key = this.createListenerKey(element, event);
    const listener = this.listeners.get(key);

    if (listener) {
      listener.element.removeEventListener(
        listener.event,
        listener.handler,
        listener.options
      );
      this.listeners.delete(key);
    }
  }

  // Remove all listeners for an element
  removeAll(element) {
    const elementKey = element.id || element.tagName;

    for (const [key, listener] of this.listeners.entries()) {
      if (listener.element === element) {
        listener.element.removeEventListener(
          listener.event,
          listener.handler,
          listener.options
        );
        this.listeners.delete(key);
      }
    }
  }

  // Cleanup all listeners
  cleanup() {
    for (const [key, listener] of this.listeners.entries()) {
      listener.element.removeEventListener(
        listener.event,
        listener.handler,
        listener.options
      );
    }
    this.listeners.clear();
    this.debounceTimers.clear();
    this.throttleTimers.clear();
    this.elementCache.clear();
  }

  // Debounce utility (delegates to PerformanceUtils, using instance store for scoping)
  debounce(func, wait, key = null) {
    return PerformanceUtils.debounce(func, wait, key, this.debounceTimers);
  }

  // Throttle utility (delegates to PerformanceUtils, using instance store for scoping)
  throttle(func, limit, key = null) {
    return PerformanceUtils.throttle(func, limit, key, this.throttleTimers);
  }

  // Element cache with automatic cleanup
  getElement(selector) {
    if (!this.elementCache.has(selector)) {
      let element = null;
      if (typeof selector === "string" && selector.startsWith("#")) {
        const matches = document.querySelectorAll(selector);
        element = matches.length ? matches[matches.length - 1] : null;
      } else {
        element = document.querySelector(selector);
      }
      if (element) {
        this.elementCache.set(selector, element);
      } else {
        // Don't cache null/undefined values to allow for dynamic element creation
        return null;
      }
    }
    return this.elementCache.get(selector);
  }

  // Create unique key for listener tracking
  createListenerKey(element, event) {
    const elementId = element.id || element.tagName || "anonymous";
    return `${elementId}-${event}`;
  }

  // Batch event registration for multiple elements
  registerBatch(registrations) {
    const keys = [];
    for (const { element, event, handler, options } of registrations) {
      const key = this.register(element, event, handler, options);
      keys.push(key);
    }
    return keys;
  }

  // Declarative event registration from config objects
  // configs: Array<{ selector: string, on: { [event: string]: { handler: Function, options?: AddEventListenerOptions, debounce?: number, throttle?: number } } }>
  registerDeclarative(configs = []) {
    const keys = [];
    configs.forEach((cfg) => {
      const element =
        typeof cfg.selector === "string"
          ? this.getElement(cfg.selector)
          : cfg.selector;
      if (!element || !cfg.on) return;
      Object.entries(cfg.on).forEach(([event, meta]) => {
        if (!meta || typeof meta.handler !== "function") return;
        let wrapped = meta.handler;
        if (typeof meta.debounce === "number") {
          wrapped = this.debounce(
            wrapped,
            meta.debounce,
            `${element.id || element.tagName}-${event}-debounced`
          );
        } else if (typeof meta.throttle === "number") {
          wrapped = this.throttle(
            wrapped,
            meta.throttle,
            `${element.id || element.tagName}-${event}-throttled`
          );
        }
        const key = this.register(element, event, wrapped, meta.options || {});
        keys.push(key);
      });
    });
    return keys;
  }

  // Delegated event registration on a container with selector matching
  // container: Element | selector string
  registerDelegated(container, event, selector, handler, options = {}) {
    const containerEl =
      typeof container === "string" ? this.getElement(container) : container;
    if (!containerEl || typeof handler !== "function") return null;
    const delegated = (e) => {
      const target =
        e.target &&
        (e.target.matches?.(selector)
          ? e.target
          : e.target.closest?.(selector));
      if (target) {
        handler.call(target, e);
      }
    };
    return this.register(containerEl, event, delegated, options);
  }

  // Register all simulation handlers (compatibility method)
  registerAllHandlers() {
    // This method is called by AlgorithmicPatternGenerator but the actual
    // simulation-specific handlers are now registered in ControlManager
    // This maintains backward compatibility
    if (typeof Logger !== "undefined") Logger.debug(
      "EventFramework: registerAllHandlers called - simulation handlers managed by ControlManager"
    );
  }
}

// Unified Control Manager
class ControlManager {
  constructor(eventFramework) {
    this.activeControls = null;
    this.eventFramework = eventFramework;
    this.eventHandlerFactory = new EventHandlerFactory(eventFramework);
    this.visibilityManager = new ControlVisibilityManager();
    this.visibilityManager.init();
  }

  // Show controls for a specific simulation type
  showControls(simType) {
    // Use the new CSS-based visibility manager
    this.visibilityManager.showControls(simType);
    this.activeControls = simType;

    // Show/hide action buttons based on simulation type
    this.showActionButtons(simType);
  }

  // Hide all simulation controls
  hideAllControls() {
    // Use the new CSS-based visibility manager
    this.visibilityManager.hideAllControls();
    this.activeControls = null;
  }

  // Show/hide action buttons based on simulation type
  showActionButtons(simType) {
    // Hide all action buttons first (except dynamic-fill-btn which manages its own visibility)
    const actionButtons = ["learn-btn"];

    actionButtons.forEach((buttonId) => {
      const button = document.getElementById(buttonId);
      if (button) {
        button.style.display = "none";
      }
    });

    // Show buttons for current simulation
    const config = ConfigurationManager.getConfig(simType);
    if (config && config.controls) {
      Object.entries(config.controls).forEach(
        ([controlName, controlConfig]) => {
          if (controlConfig.type === "button" && controlConfig.id) {
            const button = document.getElementById(controlConfig.id);
            if (button) {
              button.style.display = "inline-block";
            }
          }
        }
      );
    }
  }

  // Update control values
  updateControlValues(simType, values) {
    const config = ConfigurationManager.getConfig(simType);
    if (!config || !config.controls) return;

    Object.entries(values).forEach(([controlName, value]) => {
      const controlConfig = config.controls[controlName];
      if (controlConfig && controlConfig.type === "slider") {
        const slider = document.getElementById(controlConfig.id);
        const valueElement = document.getElementById(
          controlConfig.valueElementId
        );

        if (slider) {
          slider.value = value;
        }
        if (valueElement && controlConfig.format) {
          valueElement.textContent = controlConfig.format(value);
        }
      }
    });
  }

  // Register handlers for a specific simulation type using EventHandlerFactory
  registerSimulationHandlers(simType, app) {
    const handlers = this.eventHandlerFactory.createSimulationHandlers(
      simType,
      app
    );
    this.eventHandlerFactory.setupControls(simType, handlers);
  }

  // Register all simulation handlers using EventHandlerFactory
  registerAllHandlers(app) {
    this.eventHandlerFactory.registerAllSimulationHandlers(app);
  }

  // Cleanup simulation handlers
  cleanup() {
    this.eventHandlerFactory.cleanup();
    if (this.visibilityManager) {
      this.visibilityManager.cleanup();
    }
  }
}

// Unified Keyboard Handler
class KeyboardHandler {
  constructor(app) {
    this.app = app;
    this.shortcuts = new Map();
    this.setupShortcuts();
  }

  setupShortcuts() {
    this.shortcuts.set(" ", () => this.app.toggleSimulation());
    this.shortcuts.set("r", (e) => {
      if (e.ctrlKey || e.metaKey) {
        this.app.resetSimulation();
      } else {
        this.app.resetBrightness();
      }
    });
    this.shortcuts.set("c", (e) => {
      if (e.ctrlKey || e.metaKey) {
        this.app.clearSimulation();
      }
    });
    this.shortcuts.set("i", (e) => {
      if (e.ctrlKey || e.metaKey) {
        this.app.toggleImmersiveMode();
      }
    });
    this.shortcuts.set("Escape", () => this.app.handleEscape());
    this.shortcuts.set(",", () =>
      this.app.adjustSpeed(this.app.currentType, -1)
    );
    this.shortcuts.set(".", () =>
      this.app.adjustSpeed(this.app.currentType, 1)
    );
    this.shortcuts.set("a", () => this.app.handleAddActorAtPointer());
    this.shortcuts.set("[", () => this.app.adjustBrightness(-0.1));
    this.shortcuts.set("]", () => this.app.adjustBrightness(0.1));
  }

  handleKeydown(e) {
    const handler = this.shortcuts.get(e.key);
    if (handler) {
      e.preventDefault();
      handler(e);
    }
  }
}

// Modal Manager for handling all modals with performance optimization
class ModalManager {
  constructor(eventFramework = null) {
    this.activeModal = null;
    this.modals = new Map();
    this.elementCache = PerformanceOptimizer.createElementCache();
    this.renderQueue = new Set();
    this.isRendering = false;
    this.modalTemplateManager = new ModalTemplateManager();
    this.dynamicModalId = "dynamic-modal";
    this.currentSimType = null;
    this.scrollPositions = new Map(); // Track scroll positions for each simulation type
    this.eventFramework = eventFramework || null;
    this.init();
  }

  init() {
    // Set up global modal event listeners with throttling
    const throttledKeydown = PerformanceOptimizer.throttle((e) => {
      if (e.key === "Escape" && this.activeModal) {
        this.hide(this.activeModal);
      }
    }, 100);

    const throttledClick = PerformanceOptimizer.throttle((e) => {
      if (this.activeModal && e.target.classList.contains("modal")) {
        // Save scroll position before hiding for dynamic modal
        if (this.activeModal === this.dynamicModalId && this.currentSimType) {
          this.saveScrollPosition(this.currentSimType);
        }
        this.hide(this.activeModal);
      }
    }, 100);

    if (this.eventFramework) {
      this.eventFramework.register(document, "keydown", throttledKeydown);
      this.eventFramework.register(document, "click", throttledClick);
    } else {
      document.addEventListener("keydown", throttledKeydown);
      document.addEventListener("click", throttledClick);
    }
  }

  register(modalId, config = {}) {
    const modal = this.elementCache.get(`#${modalId}`);
    if (!modal) {
      if (typeof Logger !== "undefined") Logger.warn(`Modal with ID '${modalId}' not found`);
      else console.warn(`Modal with ID '${modalId}' not found`);
      return;
    }

    const modalConfig = {
      id: modalId,
      element: modal,
      closeBtn: modal.querySelector(".modal-close"),
      isVisible: false,
      ...config,
    };

    // Set up close button event listener
    if (modalConfig.closeBtn) {
      const onClose = () => {
        // Save scroll position before hiding for dynamic modal
        if (modalId === this.dynamicModalId && this.currentSimType) {
          this.saveScrollPosition(this.currentSimType);
        }
        this.hide(modalId);
      };
      if (this.eventFramework) {
        this.eventFramework.register(modalConfig.closeBtn, "click", onClose);
      } else {
        modalConfig.closeBtn.addEventListener("click", onClose);
      }
    }

    this.modals.set(modalId, modalConfig);
    return modalConfig;
  }

  // Register dynamic modal for a specific simulation type
  registerDynamicModal(simType) {
    if (!this.modalTemplateManager.hasTemplate(simType)) {
      if (typeof Logger !== "undefined") Logger.warn(`No template found for simulation type: ${simType}`);
      else console.warn(`No template found for simulation type: ${simType}`);
      return false;
    }

    // Register the dynamic modal if not already registered
    if (!this.modals.has(this.dynamicModalId)) {
      this.register(this.dynamicModalId);
    }

    return true;
  }

  show(modalId, simType = null) {
    const modalConfig = this.modals.get(modalId);
    if (!modalConfig) {
      if (typeof Logger !== "undefined") Logger.warn(`Modal '${modalId}' not registered`);
      else console.warn(`Modal '${modalId}' not registered`);
      return;
    }

    // If showing the dynamic modal, handle content injection
    if (modalId === this.dynamicModalId && simType) {
      // Save scroll position of previous modal if it was the dynamic modal
      if (this.activeModal === this.dynamicModalId && this.currentSimType) {
        this.saveScrollPosition(this.currentSimType);
      }

      // Update current simulation type
      this.currentSimType = simType;

      // Inject dynamic content
      this.injectDynamicContent(simType);
    }

    // Queue modal for showing
    this.queueModalRender(modalConfig, true);
    this.activeModal = modalId;

    // Trigger custom show callback
    if (modalConfig.onShow) {
      modalConfig.onShow();
    }
  }

  // Inject dynamic content for the current simulation type
  injectDynamicContent(simType) {
    const modalElement = this.modals.get(this.dynamicModalId)?.element;
    if (!modalElement) {
      if (typeof Logger !== "undefined") Logger.warn("Dynamic modal not found");
      else console.warn("Dynamic modal not found");
      return;
    }

    const success = this.modalTemplateManager.injectModalContent(
      simType,
      modalElement
    );
    if (!success) {
      if (typeof Logger !== "undefined") Logger.warn(`Failed to inject content for simulation type: ${simType}`);
      else console.warn(`Failed to inject content for simulation type: ${simType}`);
      return;
    }
  }

  // Save scroll position for a specific simulation type
  saveScrollPosition(simType) {
    const modalElement = this.modals.get(this.dynamicModalId)?.element;
    if (!modalElement) {
      if (typeof Logger !== "undefined") Logger.warn("Modal element not found for scroll position save");
      else console.warn("Modal element not found for scroll position save");
      return;
    }

    const modalContent = modalElement.querySelector(".modal-content");
    if (modalContent) {
      const currentScrollTop = modalContent.scrollTop;
      this.scrollPositions.set(simType, currentScrollTop);
    } else {
      if (typeof Logger !== "undefined") Logger.warn("Modal content element not found for scroll position save");
      else console.warn("Modal content element not found for scroll position save");
    }
  }

  // Restore scroll position for a specific simulation type
  restoreScrollPosition(simType) {
    const modalElement = this.modals.get(this.dynamicModalId)?.element;
    if (!modalElement) {
      if (typeof Logger !== "undefined") Logger.warn("Modal element not found for scroll position restore");
      else console.warn("Modal element not found for scroll position restore");
      return;
    }

    const modalContent = modalElement.querySelector(".modal-content");
    if (modalContent) {
      const savedPosition = this.scrollPositions.get(simType);
      if (savedPosition !== undefined) {
        modalContent.scrollTop = savedPosition;
      } else {
        // If no saved position, scroll to top
        modalContent.scrollTop = 0;
      }
    } else {
      if (typeof Logger !== "undefined") Logger.warn(
        "Modal content element not found for scroll position restore"
      );
      else console.warn(
        "Modal content element not found for scroll position restore"
      );
    }
  }

  hide(modalId) {
    const modalConfig = this.modals.get(modalId);
    if (!modalConfig) {
      if (typeof Logger !== "undefined") Logger.warn(`Modal '${modalId}' not registered`);
      else console.warn(`Modal '${modalId}' not registered`);
      return;
    }

    // Queue modal for hiding
    this.queueModalRender(modalConfig, false);

    if (this.activeModal === modalId) {
      this.activeModal = null;
    }

    // Trigger custom hide callback
    if (modalConfig.onHide) {
      modalConfig.onHide();
    }
  }

  // Queue modal rendering to prevent layout thrashing
  queueModalRender(modalConfig, show) {
    this.renderQueue.add({ modalConfig, show });

    if (!this.isRendering) {
      this.processRenderQueue();
    }
  }

  // Process render queue efficiently
  processRenderQueue() {
    this.isRendering = true;

    // Use requestAnimationFrame for smooth rendering
    requestAnimationFrame(() => {
      this.renderQueue.forEach(({ modalConfig, show }) => {
        if (show) {
          modalConfig.element.classList.add("show");
          modalConfig.isVisible = true;
        } else {
          modalConfig.element.classList.remove("show");
          modalConfig.isVisible = false;
        }
      });

      this.renderQueue.clear();
      this.isRendering = false;

      // Handle scroll position after modal is rendered
      if (this.activeModal === this.dynamicModalId && this.currentSimType) {
        // Use another requestAnimationFrame to ensure the modal is fully visible
        requestAnimationFrame(() => {
          this.restoreScrollPosition(this.currentSimType);
        });
      }
    });
  }

  hideAll() {
    this.modals.forEach((config, id) => {
      this.hide(id);
    });
  }

  isVisible(modalId) {
    const modalConfig = this.modals.get(modalId);
    return modalConfig ? modalConfig.isVisible : false;
  }

  // Cleanup method for memory management
  cleanup() {
    this.modals.clear();
    this.renderQueue.clear();
    this.elementCache.clear();
    this.scrollPositions.clear();
    this.activeModal = null;
  }
}

// Unified Modal System - Facade over ModalManager and ModalTemplateManager
class UnifiedModalSystem {
  constructor(eventFramework = null, modalManager = null) {
    // Reuse an existing ModalManager if provided (for maximum reuse/testing compatibility)
    this.modalManager = modalManager || new ModalManager(eventFramework);
    this.eventFramework = eventFramework || null;
    this.dynamicModalId = this.modalManager.dynamicModalId;
  }

  // Ensure the dynamic modal is registered
  ensureDynamicRegistered() {
    if (!this.modalManager.modals.has(this.dynamicModalId)) {
      this.modalManager.register(this.dynamicModalId);
    }
  }

  // Open the Learn modal for a given simulation type
  openLearn(simType) {
    if (!simType) return;
    this.modalManager.registerDynamicModal(simType);
    this.modalManager.show(this.dynamicModalId, simType);
  }

  // Open a modal by id (optionally with simType for dynamic content injection)
  openById(modalId, simType = null) {
    this.modalManager.register(modalId);
    this.modalManager.show(modalId, simType);
  }

  // Close a modal by id
  closeById(modalId) {
    this.modalManager.hide(modalId);
  }

  // Close the dynamic modal
  close() {
    this.closeById(this.dynamicModalId);
  }

  // Set modal title by id
  setTitleById(modalId, title) {
    const modalConfig = this.modalManager.modals.get(modalId);
    const el = modalConfig && modalConfig.element;
    if (!el) return;
    const titleEl = el.querySelector("[data-modal-title]");
    if (titleEl) titleEl.textContent = title;
  }

  // Set modal content by id (expects HTML string)
  setContentById(modalId, html) {
    const modalConfig = this.modalManager.modals.get(modalId);
    const el = modalConfig && modalConfig.element;
    if (!el) return;
    const contentEl = el.querySelector("[data-modal-content]");
    if (contentEl) contentEl.innerHTML = html;
  }

  // Convenience: open the dynamic modal with custom title/content
  openCustom(title, htmlContent) {
    this.ensureDynamicRegistered();
    this.setTitleById(this.dynamicModalId, title);
    this.setContentById(this.dynamicModalId, htmlContent);
    this.modalManager.show(this.dynamicModalId);
  }

  // Expose underlying manager for advanced operations/tests
  getManager() {
    return this.modalManager;
  }
}
// Main application class with performance optimization
class AlgorithmicPatternGenerator {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    // Optional consolidated managers
    this.resources =
      typeof ResourceManager !== "undefined" ? new ResourceManager() : null;
    this.canvasManager =
      typeof CanvasManager !== "undefined"
        ? new CanvasManager(this.canvas)
        : null;
    this.currentSimulation = null;
    this.currentType = "conway";
    this.isImmersive = false;
    this.brightness = 1.0; // Default brightness

    // Mouse position tracking for Add Ant feature
    this.mouseX = null;
    this.mouseY = null;

    // Performance optimization properties
    this.elementCache = PerformanceOptimizer.createElementCache();
    this.updateQueue = new Set();
    this.isUpdating = false;
    this.lastUIUpdate = 0;
    this.uiUpdateThrottle = 100; // ms between UI updates

    // Initialize managers
    this.eventFramework = new EventFramework();
    this.modalManager = new ModalManager(this.eventFramework);
    this.modalSystem = new UnifiedModalSystem(
      this.eventFramework,
      this.modalManager
    );
    this.eventHandlerFactory = new EventHandlerFactory(this.eventFramework);
    this.controlManager = new ControlManager(this.eventFramework);
    this.keyboardHandler = new KeyboardHandler(this);
    this.shortcutManager =
      typeof KeyboardShortcutManager !== "undefined"
        ? new KeyboardShortcutManager(document)
        : null;
    this.dynamicSpeedSlider = new DynamicSpeedSlider(this.eventFramework);
    this.dynamicFillButton = new DynamicFillButton(this.eventFramework);

    // URL flag for direction indicator visibility (forced override)
    this.forcedShowDirectionIndicator = null;

    // Parse URL parameters for flags
    this.parseUrlFlags();

    this.init();
  }

  init() {
    // Ensure canvas size via CanvasManager if available
    if (this.canvasManager) this.canvasManager.ensureAttachedSize();
    this.setupEventListeners();
    this.setupModals();
    this.controlManager.registerAllHandlers(this);

    // Initialize dynamic components
    this.dynamicSpeedSlider.init();
    this.dynamicFillButton.init();

    this.createSimulation(this.currentType);
    this.controlManager.showControls(this.currentType);
    this.updateUI();

    // Handle window resize with throttling
    const throttledResize = PerformanceOptimizer.throttle(() => {
      if (this.canvasManager) this.canvasManager.ensureAttachedSize();
      if (this.currentSimulation) {
        this.currentSimulation.resizePreserveState();
        this.currentSimulation.draw();
      }
    }, 250);

    if (this.resources) this.resources.on(window, "resize", throttledResize);
    else window.addEventListener("resize", throttledResize);

    // Start title fade animation after 5 seconds
    this.startTitleFade();
  }

  parseUrlFlags() {
    try {
      const search =
        typeof window !== "undefined" ? window.location.search : "";
      const params = new URLSearchParams(search || "");
      // Accepted params: dir, showDir, showDirectionIndicator
      const key = ["dir", "showDir", "showDirectionIndicator"].find((k) =>
        params.has(k)
      );
      if (!key) return;
      const raw = (params.get(key) || "").toLowerCase();
      const truthy = ["1", "true", "on", "yes"].includes(raw);
      const falsy = ["0", "false", "off", "no"].includes(raw);
      if (truthy) this.forcedShowDirectionIndicator = true;
      else if (falsy) this.forcedShowDirectionIndicator = false;
      // Any other value leaves it as null (no override)
    } catch (_) {
      // ignore parsing errors
    }
  }

  setupModals() {
    // Register the dynamic modal with the modal manager
    this.modalManager.register(this.modalManager.dynamicModalId, {
      onShow: () => {
        if (typeof Logger !== "undefined") {
          Logger.info(
            `Dynamic modal opened for ${
              this.modalManager.currentSimType || "unknown"
            } simulation`
          );
        }
      },
      onHide: () => {
        if (typeof Logger !== "undefined") Logger.info(`Dynamic modal closed`);
      },
    });
  }

  setupEventListeners() {
    // Simulation selector
    const simulationSelect =
      this.eventFramework.getElement("#simulation-select");
    if (simulationSelect) {
      this.eventFramework.register(simulationSelect, "change", (e) => {
        this.switchSimulation(e.target.value);
      });
    }

    // Control buttons with element caching
    const startPauseBtn = this.eventFramework.getElement("#start-pause-btn");
    const resetBtn = this.eventFramework.getElement("#reset-btn");
    const immersiveBtn = this.eventFramework.getElement("#immersive-btn");

    if (startPauseBtn) {
      this.eventFramework.register(startPauseBtn, "click", () =>
        this.toggleSimulation()
      );
    }
    if (resetBtn) {
      this.eventFramework.register(resetBtn, "click", () =>
        this.resetSimulation()
      );
    }
    if (immersiveBtn) {
      this.eventFramework.register(immersiveBtn, "click", () =>
        this.toggleImmersiveMode()
      );
    }

    // Setup brightness controls
    this.setupBrightnessControls();

    // Setup likelihood slider
    this.setupLikelihoodSlider();

    // Mouse move tracking for Add Ant feature
    this.eventFramework.register(this.canvas, "mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    // Keyboard shortcuts: prefer declarative manager if available
    if (this.shortcutManager) {
      this.shortcutManager.register(" ", () => this.toggleSimulation());
      this.shortcutManager.register("r", (e) => {
        if (e.ctrlKey || e.metaKey) this.resetSimulation();
        else this.resetBrightness();
      });
      this.shortcutManager.register("c", (e) => {
        if (e.ctrlKey || e.metaKey) this.clearSimulation?.();
      });
      this.shortcutManager.register("i", (e) => {
        if (e.ctrlKey || e.metaKey) this.toggleImmersiveMode();
      });
      this.shortcutManager.register("Escape", () => this.handleEscape());
      this.shortcutManager.register(",", () =>
        this.adjustSpeed(this.currentType, -1)
      );
      this.shortcutManager.register(".", () =>
        this.adjustSpeed(this.currentType, 1)
      );
      this.shortcutManager.register("a", () => this.handleAddActorAtPointer());
      this.shortcutManager.register("[", () => this.adjustBrightness(-0.1));
      this.shortcutManager.register("]", () => this.adjustBrightness(0.1));
    } else {
      this.eventFramework.register(document, "keydown", (e) => {
        this.keyboardHandler.handleKeydown(e);
      });
    }
  }

  setupBrightnessControls() {
    // Use EventHandlerFactory for brightness controls
    const brightnessConfig = {
      id: "brightness-slider",
      valueElementId: "brightness-value",
      format: (value) => `${Math.round(parseFloat(value) * 100)}%`,
    };

    const handlers = {
      brightnessChange: (value) => this.setBrightness(value),
    };

    this.eventHandlerFactory.setupSlider(brightnessConfig, handlers);

    // Initialize brightness display
    this.updateBrightnessDisplay();
  }

  setupLikelihoodSlider() {
    // Use EventHandlerFactory for likelihood controls
    const likelihoodConfig = {
      id: "likelihood-slider",
      valueElementId: "likelihood-value",
      format: (value) => `${parseInt(value)}%`,
    };

    const handlers = {
      likelihoodChange: (value) => this.setLikelihood(value),
    };

    this.eventHandlerFactory.setupSlider(likelihoodConfig, handlers);
  }

  // Initialise slider displayed values for the current simulation controls
  initVisibleSlidersFor(type) {
    const config = ConfigurationManager.getConfig(type);
    if (config && config.controls) {
      Object.values(config.controls).forEach((control) => {
        if (control.type === "slider") {
          const slider = this.eventFramework.getElement(`#${control.id}`);
          const valueElement = this.eventFramework.getElement(
            `#${control.valueElementId}`
          );
          if (slider && valueElement && control.format) {
            valueElement.textContent = control.format(slider.value);
          }
        }
      });
    }
  }

  createSimulation(type) {
    if (this.currentSimulation) {
      this.currentSimulation.pause();
    }

    this.currentType = type;
    this.currentSimulation = SimulationFactory.createSimulation(
      type,
      this.canvas,
      this.ctx
    );
    this.currentSimulation.init();

    // Apply forced direction indicator override if specified
    if (
      this.forcedShowDirectionIndicator !== null &&
      typeof this.currentSimulation.setShowDirectionIndicator === "function"
    ) {
      this.currentSimulation.setShowDirectionIndicator(
        this.forcedShowDirectionIndicator
      );
    }

    // Set brightness on the new simulation
    if (this.currentSimulation.setBrightness) {
      this.currentSimulation.setBrightness(this.brightness);
    }

    // Switch the dynamic speed slider to the new simulation
    this.dynamicSpeedSlider.switchToSimulation(type, this);
    this.dynamicFillButton.switchToSimulation(type, this);

    // Draw the simulation immediately so active cells are visible
    this.currentSimulation.draw();

    this.updateUI();
    this.initVisibleSlidersFor(type);
  }

  switchSimulation(type) {
    this.createSimulation(type);
    this.controlManager.showControls(type);
    this.initVisibleSlidersFor(type);
  }

  startSimulation() {
    if (this.currentSimulation) {
      this.currentSimulation.start();
      this.updateUI();
    }
  }

  pauseSimulation() {
    if (this.currentSimulation) {
      this.currentSimulation.pause();
      this.updateUI();
    }
  }

  toggleSimulation() {
    if (this.currentSimulation?.isRunning) {
      this.pauseSimulation();
    } else {
      this.startSimulation();
    }
  }

  resetSimulation() {
    if (this.currentSimulation) {
      this.currentSimulation.reset();
      this.updateUI();
    }
  }

  toggleImmersiveMode() {
    this.isImmersive = !this.isImmersive;
    const appElement = this.elementCache.get("#app");
    if (appElement) {
      appElement.classList.toggle("immersive", this.isImmersive);
    }

    const btn = this.elementCache.get("#immersive-btn");
    if (this.isImmersive) {
      if (btn) btn.textContent = "Exit Immersive";
      this.showImmersiveHint();
    } else {
      if (btn) btn.textContent = i18n.t("immersive-btn");
      this.hideImmersiveHint();
    }

    // Resize canvas when toggling immersive mode with delay
    setTimeout(() => {
      if (this.currentSimulation) {
        this.currentSimulation.resizePreserveState();
        this.currentSimulation.draw();
      }
    }, 300);
  }

  showImmersiveHint() {
    const hint = this.elementCache.get("#immersive-hint");
    if (hint) {
      hint.classList.add("show");

      // Hide hint after 3 seconds
      const hide = () => {
        this.hideImmersiveHint();
      };
      if (this.resources) this.resources.setTimeout(hide, 3000);
      else setTimeout(hide, 3000);
    }
  }

  hideImmersiveHint() {
    const hint = this.elementCache.get("#immersive-hint");
    if (hint) {
      hint.classList.remove("show");
    }
  }

  startTitleFade() {
    // Start fade animation after 5 seconds
    setTimeout(() => {
      const title = this.elementCache.get("#title");
      if (title) {
        title.classList.add("fade-out");
      }
    }, 5000);
  }

  handleCanvasClick(e) {
    if (!this.currentSimulation) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Allow cell toggling for all simulations
    if (this.currentSimulation.toggleCell) {
      this.currentSimulation.toggleCell(x, y);
      this.updateUI();
    }
  }

  handleEscape() {
    if (this.isImmersive) {
      this.toggleImmersiveMode();
    } else {
      // Close any open modal using modal manager
      this.modalManager.hideAll();
    }
  }

  // Throttled UI update for better performance
  updateUI() {
    const now = Date.now();
    if (now - this.lastUIUpdate < this.uiUpdateThrottle) {
      this.updateQueue.add("ui");
      if (!this.isUpdating) {
        this.processUpdateQueue();
      }
      return;
    }

    this.performUIUpdate();
    this.lastUIUpdate = now;
  }

  performUIUpdate() {
    if (!this.currentSimulation) return;

    const stats = this.currentSimulation.getStats();
    const isRunning = this.currentSimulation.isRunning;

    // Update button states
    const startPauseBtn = this.elementCache.get("#start-pause-btn");

    if (startPauseBtn) {
      startPauseBtn.textContent = isRunning ? "Pause" : "Start";
      startPauseBtn.disabled = false;
    }

    // Update stats
    const generationCount = this.elementCache.get("#generation-count");
    const cellCount = this.elementCache.get("#cell-count");
    const fps = this.elementCache.get("#fps");
    const gridSizeEl = this.elementCache.get("#grid-size");
    const canvasSizeEl = this.elementCache.get("#canvas-size");

    if (generationCount) generationCount.textContent = stats.generation;
    if (cellCount) cellCount.textContent = stats.cellCount;
    if (fps) fps.textContent = stats.fps;
    if (this.currentSimulation) {
      if (gridSizeEl) {
        gridSizeEl.textContent = `${this.currentSimulation.cols} × ${this.currentSimulation.rows}`;
      }
      if (canvasSizeEl && this.canvas) {
        canvasSizeEl.textContent = `${this.canvas.width} × ${this.canvas.height}`;
      }
    }

    // Update simulation selector
    const simulationSelect = this.elementCache.get("#simulation-select");
    if (simulationSelect) simulationSelect.value = this.currentType;

    // Show/hide simulation-specific controls
    this.controlManager.showControls(this.currentType);
  }

  processUpdateQueue() {
    this.isUpdating = true;

    requestAnimationFrame(() => {
      if (this.updateQueue.has("ui")) {
        this.performUIUpdate();
        this.updateQueue.delete("ui");
      }

      this.isUpdating = false;

      // Process any remaining updates
      if (this.updateQueue.size > 0) {
        this.processUpdateQueue();
      }
    });
  }

  // Generic speed change handler
  handleSpeedChange(simType, value) {
    if (this.currentType !== simType || !this.currentSimulation) return;

    // Parse value as integer for all simulations (steps per second)
    const parsedValue = parseInt(value);

    // Set speed on simulation
    this.currentSimulation.setSpeed(parsedValue);

    // Display updates are handled by the DynamicSpeedSlider
  }

  // Generic speed adjustment handler
  adjustSpeed(simType, direction) {
    // Use the dynamic speed slider for speed adjustments
    this.dynamicSpeedSlider.adjustSpeed(direction);
  }

  // Generic random pattern handler
  handleRandomPattern(simType) {
    if (this.currentType !== simType || !this.currentSimulation) return;

    // Get likelihood value from slider
    const likelihoodSlider =
      this.eventFramework.getElement("#likelihood-slider");
    const likelihood = likelihoodSlider
      ? parseInt(likelihoodSlider.value) / 100
      : 0.3;

    if (this.currentSimulation.randomize) {
      this.currentSimulation.randomize(likelihood);
      this.updateUI();
    }
  }

  // Generic modal handlers using modal manager
  showLearnModal(simType) {
    // Always use the current simulation type for the Learn modal
    const currentSimType = this.currentType;
    this.modalSystem.openLearn(currentSimType);
  }

  hideLearnModal(simType) {
    this.modalSystem.close();
  }

  // Generic add actor-at-pointer handler
  handleAddActorAtPointer() {
    if (!this.currentSimulation) return;
    const x = this.mouseX;
    const y = this.mouseY;
    if (typeof this.currentSimulation.addActorAt === "function") {
      this.currentSimulation.addActorAt(x, y);
    } else if (
      this.currentType === "langton" &&
      typeof this.currentSimulation.addAnt === "function"
    ) {
      // Back-compat during transition
      this.currentSimulation.addAnt(x, y);
    }
  }

  // Generic termite count change handler
  handleTermiteCountChange(count) {
    if (this.currentType !== "termite" || !this.currentSimulation) return;

    if (this.currentSimulation.setTermiteCount) {
      this.currentSimulation.setTermiteCount(count);
    }

    // Update the display value
    const config = ConfigurationManager.getConfig("termite");
    if (config) {
      const termiteControl = config.controls.termiteCount;
      if (termiteControl) {
        const valueElement = this.elementCache.get(
          `#${termiteControl.valueElementId}`
        );
        if (valueElement && termiteControl.format) {
          valueElement.textContent = termiteControl.format(count);
        }
      }
    }

    // Force a redraw to show termite count changes immediately, even when paused
    if (this.currentSimulation.draw) {
      this.currentSimulation.draw();
    }
  }

  // Generic ant count change handler
  handleAntCountChange(count) {
    if (this.currentType !== "langton" || !this.currentSimulation) return;

    if (typeof this.currentSimulation.setAntCount === "function") {
      this.currentSimulation.setAntCount(count);
    }

    // Update the display value
    const config = ConfigurationManager.getConfig("langton");
    if (config) {
      const antControl = config.controls.antCount;
      if (antControl) {
        const valueElement = this.elementCache.get(
          `#${antControl.valueElementId}`
        );
        if (valueElement && antControl.format) {
          valueElement.textContent = antControl.format(count);
        }
      }
    }

    if (this.currentSimulation.draw) {
      this.currentSimulation.draw();
    }
  }

  // Reaction–Diffusion parameter change handler
  handleReactionParamChange(name, value) {
    if (this.currentType !== "reaction" || !this.currentSimulation) return;
    if (typeof this.currentSimulation.setReactionParam === "function") {
      this.currentSimulation.setReactionParam(name, value);
    }
  }

  // Brightness control methods with performance optimization
  setBrightness(value) {
    this.brightness = Math.max(0.1, Math.min(2.0, value));
    this.updateBrightnessDisplay();

    // Update current simulation if it exists
    if (this.currentSimulation && this.currentSimulation.setBrightness) {
      this.currentSimulation.setBrightness(this.brightness);
      // Force a redraw to show brightness changes immediately, even when paused
      this.currentSimulation.draw();
    }
  }

  setLikelihood(value) {
    this.likelihood = Math.max(0, Math.min(100, value));

    // Apply likelihood to current simulation if it supports it
    if (this.currentSimulation && this.currentSimulation.setLikelihood) {
      this.currentSimulation.setLikelihood(this.likelihood);
    }
  }

  resetBrightness() {
    this.setBrightness(1.0);

    // Update slider position
    const brightnessSlider = this.elementCache.get("#brightness-slider");
    if (brightnessSlider) {
      brightnessSlider.value = 1.0;
    }
  }

  adjustBrightness(delta) {
    const brightnessSlider = this.elementCache.get("#brightness-slider");
    if (brightnessSlider) {
      const currentValue = parseFloat(brightnessSlider.value);
      const newValue = Math.max(0.1, Math.min(2.0, currentValue + delta));
      brightnessSlider.value = newValue;
      this.setBrightness(newValue);
    }
  }

  updateBrightnessDisplay() {
    const brightnessValue = this.elementCache.get("#brightness-value");
    if (brightnessValue) {
      const percentage = Math.round(this.brightness * 100);
      brightnessValue.textContent = `${percentage}%`;
    }
  }

  // Update stats continuously with throttling
  startStatsUpdate() {
    const throttledUpdate = PerformanceOptimizer.throttle(() => {
      this.updateUI();
    }, 100);

    if (this.resources) this.resources.setInterval(throttledUpdate, 100);
    else setInterval(throttledUpdate, 100);
  }

  // Cleanup method for memory management
  cleanup() {
    this.eventFramework.cleanup();
    this.eventHandlerFactory.cleanup();
    this.controlManager.cleanup();
    this.modalManager.cleanup();
    this.dynamicSpeedSlider.cleanup();
    this.dynamicFillButton.cleanup();
    if (this.shortcutManager && this.shortcutManager.cleanup)
      this.shortcutManager.cleanup();
    if (this.resources) this.resources.cleanup();
    this.elementCache.clear();
    this.updateQueue.clear();

    if (this.currentSimulation) {
      this.currentSimulation.pause();
      this.currentSimulation.cleanupDragToggling();
    }
  }
}

// Initialize the application when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Check if we're in a test environment to prevent auto-initialisation
  const isTestEnvironment =
    window.location.pathname.includes("test-suite.html") ||
    document.getElementById("test-canvas") !== null;

  if (!isTestEnvironment) {
    const app = new AlgorithmicPatternGenerator();
    app.startStatsUpdate();

    // Make app globally accessible for debugging
    window.app = app;

    // Performance monitoring
    PerformanceOptimizer.startMonitoring();
    // Global statistics collector (optional)
    if (typeof StatisticsCollector !== "undefined") {
      if (!window.statisticsCollector)
        window.statisticsCollector = new StatisticsCollector();
    }
  }
});

// Performance monitoring utility
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: [],
      memory: [],
      renderTime: [],
      updateTime: [],
    };
    this.isMonitoring = false;
    this.maxSamples = 100;
  }

  start() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitorFPS();
    this.monitorMemory();

    if (typeof Logger !== "undefined")
      Logger.info("Performance monitoring started");
  }

  stop() {
    this.isMonitoring = false;
    if (typeof Logger !== "undefined")
      Logger.info("Performance monitoring stopped");
  }

  monitorFPS() {
    if (!this.isMonitoring) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let initialized = false;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      const windowMs = currentTime - lastTime;
      if (windowMs >= 1000) {
        const denom = windowMs > 0 ? windowMs : 1;
        const fps = Math.round((frameCount * 1000) / denom);
        this.addMetric("fps", initialized ? fps : 0);
        try {
          if (
            window.statisticsCollector &&
            typeof window.statisticsCollector.addSample === "function"
          ) {
            window.statisticsCollector.addSample("fps", initialized ? fps : 0);
          }
        } catch (_) {}

        frameCount = 0;
        lastTime = currentTime;
        initialized = true;
      }

      if (this.isMonitoring) {
        requestAnimationFrame(measureFPS);
      }
    };

    requestAnimationFrame(measureFPS);
  }

  monitorMemory() {
    if (!this.isMonitoring) return;

    const measureMemory = () => {
      if (performance.memory) {
        const usedMB = Math.round(performance.memory.usedJSHeapSize / 1048576);
        this.addMetric("memory", usedMB);
      }

      if (this.isMonitoring) {
        setTimeout(measureMemory, 2000); // Check every 2 seconds
      }
    };

    measureMemory();
  }

  addMetric(type, value) {
    if (!this.metrics[type]) return;

    this.metrics[type].push({
      value,
      timestamp: Date.now(),
    });

    // Keep only recent samples
    if (this.metrics[type].length > this.maxSamples) {
      this.metrics[type].shift();
    }
  }

  getAverageMetric(type) {
    if (!this.metrics[type] || this.metrics[type].length === 0) return 0;

    const values = this.metrics[type].map((m) => m.value);
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  getMetrics() {
    return {
      averageFPS: this.getAverageMetric("fps"),
      averageMemory: this.getAverageMetric("memory"),
      samples: this.metrics,
    };
  }

  logMetrics() {
    const metrics = this.getMetrics();
    if (typeof Logger !== "undefined")
      Logger.debug("Performance Metrics:", {
        "Average FPS": Math.round(metrics.averageFPS),
        "Average Memory (MB)": Math.round(metrics.averageMemory),
        "Sample Count": Object.keys(metrics.samples).map((key) => ({
          [key]: metrics.samples[key].length,
        })),
      });
  }
}

// Extend PerformanceOptimizer with monitoring
PerformanceOptimizer.monitor = new PerformanceMonitor();

PerformanceOptimizer.startMonitoring = () => {
  PerformanceOptimizer.monitor.start();

  // Log metrics every 10 seconds
  setInterval(() => {
    PerformanceOptimizer.monitor.logMetrics();
  }, 10000);
};

PerformanceOptimizer.stopMonitoring = () => {
  PerformanceOptimizer.monitor.stop();
};
