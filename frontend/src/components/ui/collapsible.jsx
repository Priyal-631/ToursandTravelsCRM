import * as React from "react"

const Collapsible = React.forwardRef(({ open = false, onOpenChange, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(open)

  return (
    <div ref={ref} data-state={isOpen ? "open" : "closed"} {...props}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { isOpen, setIsOpen: onOpenChange || setIsOpen })
          : child
      )}
    </div>
  )
})
Collapsible.displayName = "Collapsible"

const CollapsibleTrigger = React.forwardRef(({ onClick, isOpen, setIsOpen, ...props }, ref) => (
  <button
    ref={ref}
    onClick={(e) => {
      setIsOpen?.(!isOpen)
      onClick?.(e)
    }}
    {...props}
  />
))
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const CollapsibleContent = React.forwardRef(({ isOpen, ...props }, ref) => (
  isOpen ? <div ref={ref} {...props} /> : null
))
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }