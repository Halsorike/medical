"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Comment = {
  name: string;
  text: string;
};

const INITIAL_COMMENTS: Comment[] = [
  {
    name: "Nour A.",
    text: "Helpful guide. I shared it with my family before updating our home health kit.",
  },
  {
    name: "Yazan M.",
    text: "Clear and practical. I appreciate the focus on safe routines instead of buying too much.",
  },
];

export function BlogPostInteractive() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [commentForm, setCommentForm] = useState({ name: "", text: "" });

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribed(true);
    setEmail("");
  }

  function addComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setComments((current) => [...current, { name: commentForm.name, text: commentForm.text }]);
    setCommentForm({ name: "", text: "" });
  }

  return (
    <div className="space-y-6">
      <form onSubmit={subscribe} className="space-y-3">
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Button type="submit" variant="gradient" className="w-full">
          Subscribe
        </Button>
        {subscribed && <p className="text-sm font-medium text-green-600">Thank you for subscribing!</p>}
      </form>

      <section className="rounded-2xl border bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-800">Comments</h2>
        <div className="mt-4 space-y-4">
          {comments.map((comment, index) => (
            <div key={`${comment.name}-${index}`} className="rounded-xl bg-brand-50 p-4">
              <p className="font-medium text-gray-800">{comment.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{comment.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={addComment} className="mt-5 space-y-3">
          <Input
            placeholder="Your name"
            value={commentForm.name}
            onChange={(event) => setCommentForm({ ...commentForm, name: event.target.value })}
            required
          />
          <Textarea
            rows={3}
            placeholder="Add a comment"
            value={commentForm.text}
            onChange={(event) => setCommentForm({ ...commentForm, text: event.target.value })}
            required
          />
          <Button type="submit" variant="outline" className="rounded-full">
            Submit comment
          </Button>
        </form>
      </section>
    </div>
  );
}
