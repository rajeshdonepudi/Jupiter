using Jupiter.BLL.Interfaces;
using Jupiter.Models.Dtos.QuestionAndAnswer;
using Microsoft.AspNetCore.Mvc;

namespace Jupiter.API.Controllers.QuestionAndAnswer
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionController : BaseSecureController
    {
        private readonly IQuestionService _questionService;

        public QuestionController(IQuestionService questionService)
        {
            _questionService = questionService;
        }

        [HttpPut("upsert-question")]
        public async Task<IActionResult> UpsertQuestion(BaseQuestionDto model, CancellationToken cancellationToken)
        {
            await _questionService.UpsertQuestionAsync(model, cancellationToken);

            return Ok();
        }

        [HttpPost("all-questions")]
        public async Task<IActionResult> GetAllQuestions(FilterQuestionsDto model, CancellationToken cancellationToken)
        {
            var result = await _questionService.GetAllQuestions(model, cancellationToken);

            return Ok(result);
        }

        [HttpDelete("{questionId}")]
        public async Task<IActionResult> DeleteQuestion(Guid questionId, CancellationToken cancellationToken)
        {
            await _questionService.DeleteQuestionAsync(questionId, cancellationToken);

            return NoContent();
        }
    }
}
