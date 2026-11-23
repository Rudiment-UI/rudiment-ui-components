import { useEffect, useRef, useState } from 'react'
import {
  RudiButton,
  RudiCluster,
  RudiDialog,
  RudiHeading,
  RudiStack,
  RudiText,
  rudiToast,
} from '../../index'

interface Shipment {
  id: string
  route: string
}

const initialShipments: Shipment[] = [
  { id: 'SHP-1043', route: 'Boston to Seattle' },
  { id: 'SHP-1044', route: 'Denver to Austin' },
  { id: 'SHP-1045', route: 'Chicago to Miami' },
]

/**
 * Confirming a destructive action. The dialog names exactly what will be
 * deleted and what happens next, the destructive button repeats the verb
 * instead of saying "OK", and Cancel comes first. While the request runs the
 * dialog can't be dismissed and the button shows a spinner, so the action
 * can't be sent twice.
 *
 * Cancelling returns focus to the Delete button that opened the dialog. After
 * a delete that button is gone, so focus moves to the list heading instead of
 * falling back to the page body. Needs one `RudiToastRegion` mounted near the
 * app root.
 */
export function ConfirmDialog() {
  const [shipments, setShipments] = useState(initialShipments)
  const [pending, setPending] = useState<Shipment | null>(null)
  const [isDeleting, setDeleting] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const focusHeading = useRef(false)

  // Runs after the commit that closes the dialog. Earlier, the heading is
  // still inert behind the modal and can't take focus.
  useEffect(() => {
    if (pending === null && focusHeading.current) {
      focusHeading.current = false
      headingRef.current?.focus()
    }
  }, [pending])

  const handleDelete = () => {
    if (!pending) return
    setDeleting(true)
    // Stand-in for a request to your API.
    setTimeout(() => {
      setShipments((list) => list.filter((s) => s.id !== pending.id))
      setDeleting(false)
      setPending(null)
      rudiToast.success(`Shipment ${pending.id} deleted`)
      // The Delete button that opened the dialog is gone, so focus can't return to it.
      focusHeading.current = true
    }, 900)
  }

  return (
    <RudiStack>
      <RudiHeading level={2} size={4} noMargin ref={headingRef} tabIndex={-1}>
        Scheduled shipments
      </RudiHeading>

      {shipments.length === 0 ? (
        <RudiCluster>
          <RudiText noMargin>No scheduled shipments.</RudiText>
          <RudiButton variant="ghost" size="sm" onPress={() => setShipments(initialShipments)}>
            Restore demo data
          </RudiButton>
        </RudiCluster>
      ) : (
        <RudiStack as="ul" space={3}>
          {shipments.map((s) => (
            <li key={s.id}>
              <RudiCluster justify="space-between">
                <RudiText noMargin>
                  {s.id} · {s.route}
                </RudiText>
                <RudiButton
                  variant="destructive"
                  size="sm"
                  iconBefore="lucide:trash-2"
                  aria-label={`Delete ${s.id}`}
                  onPress={() => setPending(s)}
                >
                  Delete
                </RudiButton>
              </RudiCluster>
            </li>
          ))}
        </RudiStack>
      )}

      <RudiDialog
        isOpen={pending !== null}
        onClose={() => setPending(null)}
        isDismissable={!isDeleting}
        size="sm"
        title={`Delete shipment ${pending?.id}?`}
      >
        <RudiStack space="inline">
          <RudiText noMargin>Its temperature log and documents will be deleted too.</RudiText>
          <RudiText noMargin>The receiving clinic is notified. This can't be undone.</RudiText>
        </RudiStack>
        <RudiDialog.Footer>
          <RudiButton variant="secondary" isDisabled={isDeleting} onPress={() => setPending(null)}>
            Cancel
          </RudiButton>
          <RudiButton variant="destructive" isLoading={isDeleting} onPress={handleDelete}>
            Delete shipment
          </RudiButton>
        </RudiDialog.Footer>
      </RudiDialog>
    </RudiStack>
  )
}
