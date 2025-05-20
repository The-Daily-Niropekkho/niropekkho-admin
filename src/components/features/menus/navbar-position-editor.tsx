"use client"

import { useTheme } from "@/components/theme-context"
import { DeleteOutlined, MenuOutlined, PlusOutlined } from "@ant-design/icons"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button, Card, Empty, message, Select } from "antd"
import { useState } from "react"
import "./position-editor.css"

interface Position {
  id: string
  name: string
  position: number
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
  status: string
  postCount: number
}

interface SortableItemProps {
  id: string
  name: string
  position: number
  onRemove: (id: string) => void
}

interface NavbarPositionEditorProps {
  positions: Position[]
  setPositions: (positions: Position[] | ((prev: Position[]) => Position[])) => void
  allCategories: Category[]
}

const SortableItem = ({ id, name, position, onRemove }: SortableItemProps) => {
  const { isDark } = useTheme()
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className={`sortable-item ${isDark ? "dark" : "light"}`}>
      <div className="sortable-item-content">
        <div {...attributes} {...listeners} className={`drag-handle ${isDark ? "dark" : "light"}`}>
          <MenuOutlined style={{ fontSize: "18px" }} />
        </div>
        <span className="item-name">{name}</span>
      </div>
      <div className="sortable-item-actions">
        <span className={`position-badge ${isDark ? "dark" : "light"}`}>Position: {position}</span>
        <Button danger icon={<DeleteOutlined />} onClick={() => onRemove(id)} size="middle" className="remove-button">
          Remove
        </Button>
      </div>
    </div>
  )
}

const NavbarPositionEditor = ({ positions, setPositions, allCategories }: NavbarPositionEditorProps) => {
  const { isDark } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setPositions((items: Position[]) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)

        const newItems = arrayMove(items, oldIndex, newIndex)

        // Update positions
        return newItems.map((item, index) => ({
          ...item,
          position: index + 1,
        }))
      })

      message.success("Position updated successfully")
    }
  }

  const handleAddCategory = () => {
    if (!selectedCategory) {
      message.error("Please select a category")
      return
    }

    const categoryExists = positions.some((pos) => pos.id === selectedCategory)
    if (categoryExists) {
      message.error("This category is already in the navbar")
      return
    }

    const category = allCategories.find((cat) => cat.id === selectedCategory)
    if (!category) {
      message.error("Category not found")
      return
    }

    const newPosition: Position = {
      id: category.id,
      name: category.name,
      position: positions.length + 1,
    }

    setPositions([...positions, newPosition])
    setSelectedCategory(null)
    message.success("Category added to navbar")
  }

  const handleRemoveCategory = (id: string) => {
    const newPositions = positions.filter((pos) => pos.id !== id)

    // Update positions
    const updatedPositions = newPositions.map((item, index) => ({
      ...item,
      position: index + 1,
    }))

    setPositions(updatedPositions)
    message.success("Category removed from navbar")
  }

  const availableCategories = allCategories.filter((category) => !positions.some((pos) => pos.id === category.id))

  return (
    <div className="position-editor">
      <Card className={`selector-card ${isDark ? "dark" : "light"}`}>
        <div className="selector-container">
          <Select
            placeholder="Select category to add"
            value={selectedCategory}
            onChange={setSelectedCategory}
            style={{ width: "100%", maxWidth: "300px" }}
            size="large"
            options={availableCategories.map((cat) => ({ value: cat.id, label: cat.name }))}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCategory} size="large">
            Add to Navbar
          </Button>
        </div>
      </Card>

      <div className="items-container">
        <h3 className={`section-title ${isDark ? "dark" : "light"}`}>Navbar Categories Order</h3>

        {positions.length === 0 ? (
          <Empty description="No categories in navbar" className="empty-state" />
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={positions.map((pos) => pos.id)} strategy={verticalListSortingStrategy}>
              {positions.map((position) => (
                <SortableItem
                  key={position.id}
                  id={position.id}
                  name={position.name}
                  position={position.position}
                  onRemove={handleRemoveCategory}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}

export default NavbarPositionEditor
