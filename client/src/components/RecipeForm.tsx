import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function RecipeForm({
  onSubmit,
  initialData,
}: {
  onSubmit: (data: {
    title: string;
    image: File | null;
    ingredients: string[];
    instructions: string;
    category: string;
  }) => void;
  initialData?: {
    title?: string;
    image?: string;
    ingredients?: string[];
    instructions?: string;
    category?: string;
  };
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [image, setImage] = useState<File | null>(null);
  const [ingredients, setIngredients] = useState(
    initialData?.ingredients?.join(", ") || ""
  );
  const [instructions, setInstructions] = useState(
    initialData?.instructions || ""
  );
  const [category, setCategory] = useState(initialData?.category || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      image,
      ingredients: ingredients
        .split(",")
        .map((ingredient) => ingredient.trim()), // Convert back to an array
      instructions,
      category,
    });
    setTitle("");
    setImage(null);
    setIngredients("");
    setInstructions("");
    setCategory("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title Input */}
      <div className="grid w-full gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter recipe title"
        />
      </div>

      {/* Image Input */}
      <div className="grid w-full gap-1.5">
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
      </div>

      {/* Ingredients Input */}
      <div className="grid w-full gap-1.5">
        <Label htmlFor="ingredients">Ingredients</Label>
        <Input
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Enter ingredients, separated by commas"
        />
      </div>

      {/* Instructions Input */}
      <div className="grid w-full gap-1.5">
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Enter recipe instructions"
        />
      </div>

      {/* Category Input */}
      <div className="grid w-full gap-1.5">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter recipe category"
        />
      </div>

      {/* Submit Button */}
      <Button type="submit">Submit</Button>
    </form>
  );
}
